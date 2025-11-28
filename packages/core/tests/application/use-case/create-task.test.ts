import { CreateTaskUseCase } from "@/application/use-case";
import { CreateTask } from "@/contracts/repos";

describe("CREATE TASK", () => {
  let sut: CreateTaskUseCase;
  let taskRepo: jest.Mocked<CreateTask>;
  let input: CreateTask.Input;

  beforeAll(() => {
    taskRepo = {
      create: jest.fn(),
    };
    input = {
      title: "any_title",
      description: "any_description",
      priority: "LOW",
      dueDate: new Date(),
    };
  });

  beforeEach(() => {
    sut = new CreateTaskUseCase(taskRepo);
  });

  it("Should call CreateTask with correct input", async () => {
    await sut.execute(input);

    expect(taskRepo.create).toHaveBeenCalledTimes(1);
    expect(taskRepo.create).toHaveBeenCalledWith({
      title: "any_title",
      description: "any_description",
      priority: "LOW",
      dueDate: expect.any(Date),
    });
  });
});
