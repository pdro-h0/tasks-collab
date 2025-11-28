export class TaskNotFound extends Error {
  constructor() {
    super("Task not found");
    this.name = "TaskNotFound";
  }
}
