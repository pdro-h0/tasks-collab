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

export interface UpdateTask {
  update(input: UpdateTask.Input): Promise<void>;
}
export namespace UpdateTask {
  export type Input = {
    id: string;
    taskData: {
      title?: string;
      description?: string;
      status?: "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE";
      priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
      dueDate?: Date;
      assignedUserIds?: string[];
    };
  };
}

export interface CommentTask {
  comment(input: CommentTask.Input): Promise<void>;
}
export namespace CommentTask {
  export type Input = {
    taskId: string;
    userId: string;
    content: string;
  };
}
