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
