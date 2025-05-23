import {
  createUserProjectSchema,
  updateUserProjectSchema,
  idParamSchema
} from "../../schemas/userProject.schema";

describe("createUserProjectSchema", () => {
  it("should pass with valid data", () => {
    const result = createUserProjectSchema.safeParse({
      body: {
        userId: "user123",
        projectId: "project123",
        roleInProject: "owner",
        joinedAt: new Date()
      }
    });
    expect(result.success).toBe(true);
  });

  it("should default roleInProject to 'member' if not provided", () => {
    const result = createUserProjectSchema.safeParse({
      body: {
        userId: "user123",
        projectId: "project123"
      }
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.body.roleInProject).toBe("member");
    }
  });

  it("should fail if roleInProject is invalid", () => {
    const result = createUserProjectSchema.safeParse({
      body: {
        userId: "user123",
        projectId: "project123",
        roleInProject: "invalidRole"
      }
    });
    expect(result.success).toBe(false);
  });
});

describe("updateUserProjectSchema", () => {
  it("should pass with valid data and valid id param", () => {
    const result = updateUserProjectSchema.safeParse({
      body: {
        userId: "user123",
        projectId: "project123",
        roleInProject: "guest",
        joinedAt: new Date()
      },
      params: {
        id: "0123456789abcdef01234567"
      }
    });
    expect(result.success).toBe(true);
  });

  it("should fail if id param is invalid length", () => {
    const result = updateUserProjectSchema.safeParse({
      body: {
        userId: "user123",
        projectId: "project123",
        roleInProject: "guest"
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
  it("should pass with valid id", () => {
    const result = idParamSchema.safeParse({
      params: {
        id: "abcdefabcdefabcdefabcdef"
      }
    });
    expect(result.success).toBe(true);
  });

  it("should fail with invalid id length", () => {
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
