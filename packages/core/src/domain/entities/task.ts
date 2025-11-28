import { TaskHistory, Comment } from "@/domain/entities";

export type Task = {
  id: string;
  title: string;
  description: string;
  status: "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  dueDate: Date;
  assignedUserIds: string[];
  comments: Comment[];
  history: TaskHistory[];
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
};
