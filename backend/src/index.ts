import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import userRoutes from "./routes/user.route";
import projectRoutes from "./routes/project.route";
import taskRoutes from "./routes/task.route";
import { errorMiddleware } from "./middlewares/error.middleware";

dotenv.config();

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
    this.connectDatabase();
    this.routes();
  }

  private config(): void {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(helmet());
    this.app.use(morgan("dev"));
  }

  private connectDatabase(): void {
    const MONGO_URI = process.env.MONGO_URI || "";
    mongoose
      .connect(MONGO_URI)
      .then(() => console.log("Connected to MongoDB"))
      .catch((err) => console.error("MongoDB connection error:", err));
  }

  private routes(): void {
    this.app.use("/api/v1/users", userRoutes);
    this.app.use("/api/v1/projects", projectRoutes);
    this.app.use("/api/v1/tasks", taskRoutes);

    this.app.use(errorMiddleware);
  }

  public start(): void {
    const PORT = process.env.PORT || 3000;
    this.app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
}

const app = new App();
app.start();
