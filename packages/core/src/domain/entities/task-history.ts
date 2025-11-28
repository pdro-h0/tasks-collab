export type TaskHistory = {
  id: string;
  userId: string;
  action: string;
  timestamp: Date;
  changes: Record<string, { oldValue: any; newValue: any }>;
};
