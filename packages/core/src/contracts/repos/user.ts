export interface CreateUser {
  create(input: CreateUser.Input): Promise<void>;
}
export namespace CreateUser {
  export type Input = {
    name: string;
    email: string;
    password: string;
  };
}

export interface GetUser {
  getByEmail(input: GetUser.InputByEmail): Promise<GetUser.Output | null>;
  getById(input: GetUser.InputById): Promise<GetUser.Output | null>;
}
export namespace GetUser {
  export type InputByEmail = {
    email: string;
  };
  export type InputById = {
    id: string;
  };
  export type Output = {
    id: string;
    name: string;
    email: string;
    password: string;
  };
}

export interface AuthenticateUser {
  authenticate(input: AuthenticateUser.Input): Promise<void>;
}
export namespace AuthenticateUser {
  export type Input = {
    email: string;
    password: string;
  };
}
