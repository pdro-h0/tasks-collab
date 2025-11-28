import { DeleteTask, GetTask } from "@/contracts/repos";
import { TaskNotFound } from "@/domain/errors";

export class DeleteTaskUseCase {
  constructor(private readonly taskRepo: DeleteTask & GetTask) {}

  async execute(input: DeleteTask.Input): Promise<void> {
    const task = await this.taskRepo.getById({ id: input.id });
    if (!task) throw new TaskNotFound();
    await this.taskRepo.delete({ id: input.id });
  }
}
