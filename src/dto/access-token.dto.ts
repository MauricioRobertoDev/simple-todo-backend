export interface AccessTokenPaylod {
  id: string;
}

export interface AccessTokenDecoded extends AccessTokenPaylod {
  iat: number;
  exp: number;
}
