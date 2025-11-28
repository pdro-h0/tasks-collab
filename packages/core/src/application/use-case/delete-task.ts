import { DeleteTask, GetTask } from "@/contracts/repos";

export class DeleteTaskUseCase {
  constructor(private readonly taskRepo: DeleteTask & GetTask) {}

  async execute(input: DeleteTask.Input): Promise<void> {
    const task = await this.taskRepo.getById({ id: input.id });
    if (!task) throw new Error("Task not found");
    await this.taskRepo.delete({ id: input.id });
  }
}
