export interface CreateTask {
  create(input: CreateTask.Input): Promise<void>;
}
export namespace CreateTask {
  export type Input = {
    title: string;
    description: string;
    priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
    dueDate: Date;
    assignedUserIds?: string[];
    authorId: string;
  };
}
