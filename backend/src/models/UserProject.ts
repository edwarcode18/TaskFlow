import { Schema, model } from "mongoose";
import { IUserProjectDocument } from "../interfaces/userProject.interface";

const userProjectSchema = new Schema<IUserProjectDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true
    },
    roleInProject: {
      type: String,
      enum: ["owner", "member", "guest"],
      default: "member"
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

userProjectSchema.index({ userId: 1, projectId: 1 }, { unique: true });

export const UserProject = model<IUserProjectDocument>(
  "UserProject",
  userProjectSchema
);
