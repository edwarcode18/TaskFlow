import { loginSchema } from "../../schemas/auth.schema";

describe("loginSchema", () => {
  it("should pass validation with valid email and password", () => {
    const result = loginSchema.safeParse({
      body: {
        email: "test@example.com",
        password: "password123"
      }
    });

    expect(result.success).toBe(true);
  });

  it("should fail if email is invalid", () => {
    const result = loginSchema.safeParse({
      body: {
        email: "invalid-email",
        password: "password123"
      }
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const errorMessages = result.error.format().body?.email?._errors;
      expect(errorMessages).toContain("Email inválido");
    }
  });

  it("should fail if password is too short", () => {
    const result = loginSchema.safeParse({
      body: {
        email: "test@example.com",
        password: "123"
      }
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const errorMessages = result.error.format().body?.password?._errors;
      expect(errorMessages).toContain("La contraseña debe tener al menos 6 caracteres");
    }
  });

  it("should fail if body is missing", () => {
    const result = loginSchema.safeParse({});

    expect(result.success).toBe(false);
    if (!result.success) {
      const errorMessages = result.error.format().body?._errors;
      expect(errorMessages).toBeDefined();
    }
  });
});
