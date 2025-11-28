export interface HashPassword {
  hash(input: HashPassword.Input): Promise<string>;
}
export namespace HashPassword {
  export type Input = {
    password: string;
  };
}

export interface ComparePassword {
  compare(input: ComparePassword.Input): Promise<boolean>;
}
export namespace ComparePassword {
  export type Input = {
    password: string;
    hashedPassword: string;
  };
}
