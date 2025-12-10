import { CommentTaskUseCase } from "@/application/use-case/comment-task";
import { CommentTask, GetTask } from "@/contracts/repos";

describe("COMMENT TASK", () => {
  let sut: CommentTaskUseCase;
  let taskRepo: jest.Mocked<GetTask & CommentTask>;
  let input: CommentTask.Input;

  beforeAll(() => {
    taskRepo = {
      comment: jest.fn(),
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
    };
    input = {
      taskId: "any_task_id",
      userId: "any_user_id",
      content: "any_content",
    };
  });

  beforeEach(async () => {
    sut = new CommentTaskUseCase(taskRepo);
  });

  it("Should call GetTask with correct input", async () => {
    await sut.execute(input);

    expect(taskRepo.getById).toHaveBeenCalledTimes(1);
    expect(taskRepo.getById).toHaveBeenCalledWith({ id: "any_task_id" });
  });

  it("Should throw if GetTask returns null", async () => {
    taskRepo.getById.mockResolvedValueOnce(null);
    await expect(sut.execute(input)).rejects.toThrow();
  });

  it("Should call GetTask with correct input", async () => {
    await sut.execute(input);

    expect(taskRepo.comment).toHaveBeenCalledTimes(1);
    expect(taskRepo.comment).toHaveBeenCalledWith({
      taskId: "any_task_id",
      userId: "any_user_id",
      content: "any_content",
    });
  });
});
