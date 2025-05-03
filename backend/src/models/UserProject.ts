import { Schema, model, Document, Types } from "mongoose";

type RoleInProject = "owner" | "member" | "guest";

export interface IUserProject extends Document {
  userId: Types.ObjectId;
  projectId: Types.ObjectId;
  roleInProject: RoleInProject;
  joinedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userProjectSchema = new Schema<IUserProject>(
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

export const UserProject = model<IUserProject>(
  "UserProject",
  userProjectSchema
);
