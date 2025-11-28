import { Task } from "@/domain/entities";

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

export interface DeleteTask {
  delete(input: DeleteTask.Input): Promise<void>;
}
export namespace DeleteTask {
  export type Input = {
    id: string;
  };
}

export interface GetTask {
  getById(input: GetTask.Input): Promise<Task | null>;
}
export namespace GetTask {
  export type Input = {
    id: string;
  };
}
