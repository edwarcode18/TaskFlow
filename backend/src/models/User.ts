import bcrypt from "bcryptjs";
import { Schema, model } from "mongoose";
import PasswordValidator from "password-validator";
import validator from "validator";
import { IUserDocument } from "../interfaces/user.interface";

const schema = new PasswordValidator();
schema.is().min(6).has().uppercase().has().lowercase().has().digits();

const userSchema = new Schema<IUserDocument>(
  {
    name: {
      type: String,
      unique: true,
      trim: true,
      required: true,
      minlength: 3
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
      validate: [validator.isEmail, "Por favor ingrese un email válido"],
      minlength: 5
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      validate: {
        validator: (value: string) =>
          schema.validate(value, { list: false }) as boolean,
        message: "La contraseña no cumple con los requisitos mínimos"
      }
    },
    language: {
      type: String,
      enum: ["es", "en"],
      default: "es"
    },
    role: {
      type: String,
      enum: ["admin", "user", "guest"],
      default: "user"
    }
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform: (_, ret) => {
        delete ret.password;
        return ret;
      }
    }
  }
);

userSchema.pre<IUserDocument>("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(new Error("Password hashing failed"));
  }
});

export const User = model<IUserDocument>("User", userSchema);
