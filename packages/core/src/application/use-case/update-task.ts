import { GetTask, UpdateTask } from "@/contracts/repos";
import { TaskNotFound } from "@/domain/errors";

export class UpdateTaskUseCase {
  constructor(private readonly taskRepo: GetTask & UpdateTask) {}

  async execute(input: UpdateTask.Input): Promise<void> {
    const task = await this.taskRepo.getById({ id: input.id });
    if (!task) throw new TaskNotFound();
    await this.taskRepo.update({
      id: input.id,
      taskData: input.taskData,
    });
  }
}
