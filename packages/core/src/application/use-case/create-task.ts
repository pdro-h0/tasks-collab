import { CreateTask } from "@/contracts/repos";

export class CreateTaskUseCase {
  constructor(private readonly taskRepo: CreateTask) {}
  async execute(input: CreateTask.Input) {
    this.taskRepo.create(input);
    return;
  }
}
