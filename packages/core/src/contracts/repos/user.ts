import { User } from "@/domain/entities";

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
  getByEmail(input: GetUser.InputByEmail): Promise<User | null>;
  getById(input: GetUser.InputById): Promise<User | null>;
}
export namespace GetUser {
  export type InputByEmail = {
    email: string;
  };
  export type InputById = {
    id: string;
  };
}

export namespace AuthenticateUser {
  export type Input = {
    email: string;
    password: string;
  };
  export type Output = {
    token: string;
  };
}
