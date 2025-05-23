import {
  createTaskSchema,
  updateTaskSchema,
  idParamSchema
} from "../../schemas/task.schema";

describe("createTaskSchema", () => {
  it("should pass with valid data", () => {
    const result = createTaskSchema.safeParse({
      body: {
        title: "Task title",
        description: "Task description",
        status: "todo",
        priority: "low",
        dueDate: new Date(),
        assignee: "user123",
        projectId: "project123"
      }
    });
    expect(result.success).toBe(true);
  });

  it("should fail if title is too short", () => {
    const result = createTaskSchema.safeParse({
      body: {
        title: "ab",
        description: "Task description",
        status: "todo",
        priority: "low",
        dueDate: new Date(),
        assignee: "user123",
        projectId: "project123"
      }
    });
    expect(result.success).toBe(false);
  });

  it("should fail if status is invalid", () => {
    const result = createTaskSchema.safeParse({
      body: {
        title: "Valid title",
        description: "Valid description",
        status: "invalid-status",
        priority: "low",
        dueDate: new Date(),
        assignee: "user123",
        projectId: "project123"
      }
    });
    expect(result.success).toBe(false);
  });
});

describe("updateTaskSchema", () => {
  it("should pass with valid data and valid id", () => {
    const result = updateTaskSchema.safeParse({
      body: {
        title: "Updated title",
        description: "Updated description",
        status: "done",
        priority: "high",
        dueDate: new Date(),
        assignee: "user456",
        projectId: "project456"
      },
      params: {
        id: "0123456789abcdef01234567"
      }
    });
    expect(result.success).toBe(true);
  });

  it("should fail if id length is invalid", () => {
    const result = updateTaskSchema.safeParse({
      body: {
        title: "Updated title",
        description: "Updated description",
        status: "done",
        priority: "high",
        dueDate: new Date(),
        assignee: "user456",
        projectId: "project456"
      },
      params: {
        id: "123"
      }
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.format().params?.id?._errors).toContain(
        "Invalid ID format"
      );
    }
  });
});

describe("idParamSchema", () => {
  it("should pass with valid id param", () => {
    const result = idParamSchema.safeParse({
      params: {
        id: "abcdefabcdefabcdefabcdef"
      }
    });
    expect(result.success).toBe(true);
  });

  it("should fail with invalid id param length", () => {
    const result = idParamSchema.safeParse({
      params: {
        id: "abc123"
      }
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.format().params?.id?._errors).toContain(
        "Invalid ID format"
      );
    }
  });
});
