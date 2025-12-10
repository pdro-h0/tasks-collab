import { CommentTask, GetTask } from "@/contracts/repos";
import { TaskNotFound } from "@/domain";

export class CommentTaskUseCase {
  constructor(private readonly taskRepo: GetTask & CommentTask) {}

  async execute(input: CommentTask.Input): Promise<void> {
    const task = await this.taskRepo.getById({ id: input.taskId });
    if (!task) throw new TaskNotFound();
    await this.taskRepo.comment(input);
  }
}
