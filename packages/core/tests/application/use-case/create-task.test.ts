export class CreateTaskUseCase {
  constructor(private readonly taskRepo: CreateTask) {}
  async execute(input: CreateTask.Input) {
    this.taskRepo.create(input);
    return;
  }
}

export interface CreateTask {
  create(input: CreateTask.Input): Promise<void>;
}
export namespace CreateTask {
  export type Input = {
    title: string;
    description: string;
    priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
    dueDate: Date;
  };
}

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
