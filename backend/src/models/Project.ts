import { Schema, model } from "mongoose";
import { IProjectDocument } from "../interfaces/project.interface";

const projectSchema = new Schema<IProjectDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3
    },
    description: {
      type: String,
      trim: true,
      required: true,
      minlength: 5
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

export const Project = model<IProjectDocument>("Project", projectSchema);
