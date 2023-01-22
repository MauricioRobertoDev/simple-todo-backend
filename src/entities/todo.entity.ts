import { TodoDescription, TodoStatus } from "@/objects";
import { Entity } from "./abstract.entity";

type TodoProps = {
  description: TodoDescription;
  status: TodoStatus;
  createdAt: Date;
  startAt?: Date;
  endAt?: Date;
};

export class TodoEntity extends Entity<TodoProps> {}
