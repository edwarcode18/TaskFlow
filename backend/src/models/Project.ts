import { Schema, model, Document, Types } from "mongoose";

export interface IProject extends Document {
  name: string;
  description: string;
  owner: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
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

export const Project = model<IProject>("Project", projectSchema);
