import { NextFunction, Request, Response } from "express";
import { describe, expect, test, vi } from "vitest";
import { auth } from "@/middlewares/auth.middleware";
import { Message } from "@/util/messages";
import { HttpStatus } from "@/util/http-status";
import jwt from "jsonwebtoken";

describe("Authentication Middleare", () => {
  test("Deve prosseguir com a requisição caso tenha passado um token válido", async () => {
    const secret = process.env.APP_SECRET as string;
    const token = jwt.sign({ id: "uuid-batata" }, secret, { expiresIn: "1d" });
    const mockRequest: Partial<Request> = {
      headers: { authorization: `Bearer ${token}` },
    };
    const mockResponse: Partial<Response> = {};
    const nextFunction: NextFunction = vi.fn(() => "");

    auth(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockRequest.userId).toBe("uuid-batata");
    expect(nextFunction).toBeCalled();
  });

  test("Deve retornar não autorizado, caso não tenha passado o token", async () => {
    const mockRequest: Partial<Request> = { headers: {} };
    const mockResponse: Partial<Response> = { json: vi.fn(), status: vi.fn() };
    const nextFunction: NextFunction = vi.fn(() => "");
    const expectedResponse = { message: Message.INVALID_ACCESS_TOKEN };

    auth(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toBeCalledWith(HttpStatus.UNAUTHORIZED);
    expect(mockResponse.json).toBeCalledWith(expectedResponse);
  });

  test("Deve retornar não autorizado, caso tenha passado algo que não seja um token", async () => {
    const mockRequest: Partial<Request> = {
      headers: { authorization: "Bearer invalid_token" },
    };
    const mockResponse: Partial<Response> = { json: vi.fn(), status: vi.fn() };
    const nextFunction: NextFunction = vi.fn(() => "");
    const expectedResponse = { message: Message.INVALID_ACCESS_TOKEN };

    auth(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toBeCalledWith(HttpStatus.UNAUTHORIZED);
    expect(mockResponse.json).toBeCalledWith(expectedResponse);
  });

  test("Deve retornar não autorizado, caso tenha passado um token qualquer", async () => {
    const token = jwt.sign({ id: "batata" }, "invalid_secret");
    const mockRequest: Partial<Request> = {
      headers: { authorization: `Bearer ${token}` },
    };
    const mockResponse: Partial<Response> = { json: vi.fn(), status: vi.fn() };
    const nextFunction: NextFunction = vi.fn(() => "");
    const expectedResponse = { message: Message.INVALID_ACCESS_TOKEN };

    auth(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toBeCalledWith(HttpStatus.UNAUTHORIZED);
    expect(mockResponse.json).toBeCalledWith(expectedResponse);
  });

  test("Deve retornar não autorizado, caso tenha passado um token expirado", async () => {
    const secret = process.env.APP_SECRET as string;
    const token = jwt.sign({ id: "batatatoes" }, secret, { expiresIn: -1 });
    const mockRequest: Partial<Request> = {
      headers: { authorization: `Bearer ${token}` },
    };
    const mockResponse: Partial<Response> = { json: vi.fn(), status: vi.fn() };
    const nextFunction: NextFunction = vi.fn(() => "");
    const expectedResponse = { message: Message.INVALID_ACCESS_TOKEN };

    auth(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toBeCalledWith(HttpStatus.UNAUTHORIZED);
    expect(mockResponse.json).toBeCalledWith(expectedResponse);
  });
});
