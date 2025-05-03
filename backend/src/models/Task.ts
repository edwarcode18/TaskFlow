import { Schema, model, Document, Types } from "mongoose";

type Status = "todo" | "in-progress" | "done";
type Priority = "low" | "medium" | "high";

export interface ITask extends Document {
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  dueDate?: Date;
  assignee: Types.ObjectId;
  projectId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 5
    },
    status: {
      type: String,
      enum: ["todo", "in-progress", "done"],
      default: "todo"
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low"
    },
    dueDate: {
      type: Date,
      validate: {
        validator: (value: Date) => !value || value > new Date(),
        message: "La fecha de vencimiento debe ser futura"
      }
    },
    assignee: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true
    }
  },
  {
    timestamps: true
  }
);

export const Task = model<ITask>("Task", taskSchema);
