import { UpdateTaskUseCase } from "@/application/use-case";
import { GetTask, UpdateTask } from "@/contracts/repos";

describe("UPDATE TASK", () => {
  let sut: UpdateTaskUseCase;
  let taskRepo: jest.Mocked<GetTask & UpdateTask>;
  let input: UpdateTask.Input;

  beforeAll(() => {
    taskRepo = {
      getById: jest.fn().mockReturnValue({
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
      update: jest.fn(),
    };
    input = {
      id: "any_task_id",
      taskData: {
        status: "IN_PROGRESS",
        description: "another_description",
      },
    };
  });

  beforeEach(async () => {
    sut = new UpdateTaskUseCase(taskRepo);
  });

  it("Should call GetTask with correct input", async () => {
    await sut.execute(input);
    expect(taskRepo.getById).toHaveBeenCalledWith({ id: "any_task_id" });
  });

  it("Should throw if GetTask returns null", async () => {
    taskRepo.getById.mockResolvedValueOnce(null);
    await expect(sut.execute(input)).rejects.toThrow();
  });

  it("Should call UpdateTask with correct input", async () => {
    await sut.execute(input);
    expect(taskRepo.update).toHaveBeenCalledWith({
      id: "any_task_id",
      taskData: {
        status: "IN_PROGRESS",
        description: "another_description",
      },
    });
  });
});
