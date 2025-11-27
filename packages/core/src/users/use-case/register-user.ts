import { CreateUser } from "@/contracts/repos";

export class RegisterUserUseCase {
  constructor(private userRepo: CreateUser) {}

  async execute(input: CreateUser.Input): Promise<void> {
    await this.userRepo.create(input);
  }
}
