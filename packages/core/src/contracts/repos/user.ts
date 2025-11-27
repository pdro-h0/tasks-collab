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
  getByEmail(input: GetUser.Input): Promise<GetUser.Output | null>;
}
export namespace GetUser {
  export type Input = {
    email: string;
  };
  export type Output = {
    id: string;
    name: string;
    email: string;
    password: string;
  };
}
