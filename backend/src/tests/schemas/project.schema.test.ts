import {
  createProjectSchema,
  updateProjectSchema,
  idParamSchema
} from "../../schemas/project.schema";

describe("createProjectSchema", () => {
  it("should pass with valid data", () => {
    const result = createProjectSchema.safeParse({
      body: {
        name: "Mi Proyecto",
        description: "Una descripción válida",
        owner: "user123"
      }
    });
    expect(result.success).toBe(true);
  });

  it("should fail if name is too short", () => {
    const result = createProjectSchema.safeParse({
      body: {
        name: "ab",
        description: "Descripción válida",
        owner: "user123"
      }
    });
    expect(result.success).toBe(false);
  });

  it("should fail if description is too short", () => {
    const result = createProjectSchema.safeParse({
      body: {
        name: "Proyecto",
        description: "abc",
        owner: "user123"
      }
    });
    expect(result.success).toBe(false);
  });
});

describe("updateProjectSchema", () => {
  it("should pass with valid data", () => {
    const result = updateProjectSchema.safeParse({
      body: {
        name: "Nuevo Nombre",
        description: "Descripción actualizada",
        owner: "user456"
      },
      params: {
        id: "0123456789abcdef01234567"
      }
    });
    expect(result.success).toBe(true);
  });

  it("should fail if id param is invalid length", () => {
    const result = updateProjectSchema.safeParse({
      body: {
        name: "Nombre",
        description: "Descripción",
        owner: "user456"
      },
      params: {
        id: "123"
      }
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.format().params?.id?._errors).toContain("Invalid ID format");
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
      expect(result.error.format().params?.id?._errors).toContain("Invalid ID format");
    }
  });
});