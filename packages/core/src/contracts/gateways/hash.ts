export interface HashPassword {
  hash(input: HashPassword.Input): Promise<string>;
}
export namespace HashPassword {
  export type Input = {
    password: string;
  };
}
