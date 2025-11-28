import { DeleteTaskUseCase } from "@/application/use-case";
import { DeleteTask, GetTask } from "@/contracts/repos";

describe("DELETE TASK", () => {
  let sut: DeleteTaskUseCase;
  let taskRepo: jest.Mocked<DeleteTask & GetTask>;
  let input: DeleteTask.Input;

  beforeAll(() => {
    taskRepo = {
      delete: jest.fn(),
      getById: jest.fn().mockResolvedValue({
        id: "any_id",
        title: "any_title",
        description: "any_description",
        status: "TODO",
        priority: "LOW",
        dueDate: new Date(),
        assignedUserIds: [],
        comments: [],
        history: [],
        authorId: "any_author_id",
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    };
    input = {
      id: "any_task_id",
    };
  });

  beforeEach(() => {
    sut = new DeleteTaskUseCase(taskRepo);
  });

  it("should call DeleteTask with correct input", async () => {
    await sut.execute(input);

    expect(taskRepo.delete).toHaveBeenCalledTimes(1);
    expect(taskRepo.delete).toHaveBeenCalledWith({
      id: "any_task_id",
    });
  });

  it("should throw if GetTask returns null", async () => {
    taskRepo.getById.mockResolvedValueOnce(null);

    const promise = sut.execute(input);

    await expect(promise).rejects.toThrow("Task not found");
    expect(taskRepo.getById).toHaveBeenCalledTimes(1);
  });
});
