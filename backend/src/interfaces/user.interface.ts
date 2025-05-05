import { Document } from "mongoose";

export type Language = "es" | "en";
export type Role = "admin" | "user" | "guest";

export interface IUser {
  name: string;
  email: string;
  password: string;
  language?: Language;
  role?: Role;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserDocument extends IUser, Document {
  _id: string;
}

export interface IUserResponse extends Omit<IUser, "password"> {
  _id: string;
}
