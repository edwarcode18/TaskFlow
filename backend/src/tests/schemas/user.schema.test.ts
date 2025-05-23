import {
  createUserSchema,
  updateUserSchema,
  idParamSchema
} from "../../schemas/user.schema";

describe("createUserSchema", () => {
  it("should pass with valid data", () => {
    const result = createUserSchema.safeParse({
      body: {
        name: "Juan Pérez",
        email: "juan@example.com",
        password: "Abc123",
        language: "es",
        role: "user"
      }
    });
    expect(result.success).toBe(true);
  });

  it("should fail if password doesn't meet requirements", () => {
    const result = createUserSchema.safeParse({
      body: {
        name: "Juan Pérez",
        email: "juan@example.com",
        password: "abc123", // no uppercase
        language: "es",
        role: "user"
      }
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const issues = result.error.errors.map((e) => e.message);
      expect(issues).toContain("Must contain an uppercase letter");
    }
  });

  it("should fail if email is invalid", () => {
    const result = createUserSchema.safeParse({
      body: {
        name: "Juan Pérez",
        email: "juanexample.com",
        password: "Abc123",
        language: "es",
        role: "user"
      }
    });
    expect(result.success).toBe(false);
  });
});

describe("updateUserSchema", () => {
  it("should pass with valid partial data and valid id", () => {
    const result = updateUserSchema.safeParse({
      body: {
        name: "Nuevo Nombre",
        email: "nuevo@example.com",
        language: "en",
        role: "admin"
      },
      params: {
        id: "0123456789abcdef01234567"
      }
    });
    expect(result.success).toBe(true);
  });

  it("should pass if body is empty but id is valid", () => {
    const result = updateUserSchema.safeParse({
      body: {},
      params: {
        id: "0123456789abcdef01234567"
      }
    });
    expect(result.success).toBe(true);
  });

  it("should fail if id is invalid length", () => {
    const result = updateUserSchema.safeParse({
      body: {
        name: "Name"
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
