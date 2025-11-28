export interface TokenPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface RefreshToken {
  execute(input: RefreshToken.Input): Promise<RefreshToken.Output>;
}

export namespace RefreshToken {
  export type Input = {
    refreshToken: string;
  };

  export type Output = {
    accessToken: string;
    refreshToken: string;
  };
}

export interface GenerateToken {
  generate(input: GenerateToken.Input): Promise<GenerateToken.Output>;
}

export namespace GenerateToken {
  export type Input = {
    userId: string;
    email: string;
    expiresInMs: number;
  };
  export type Output = string;
}

export interface ValidateToken {
  verify(input: ValidateToken.Input): Promise<ValidateToken.Output>;
}

export namespace ValidateToken {
  export type Input = {
    token: string;
  };
  export type Output = TokenPayload;
}
