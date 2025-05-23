import { Router } from "express";
import { TaskController } from "../controllers/task.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { zodValidate } from "../middlewares/zodValidate.middleware";
import {
  createTaskSchema,
  idParamSchema,
  updateTaskSchema
} from "../schemas/task.schema";

const router = Router();
const controller = new TaskController();

router.get("/", authenticate, controller.getAllTask);
router.get("/:id", authenticate, zodValidate(idParamSchema), controller.getTasksById);
router.post("/", authenticate, zodValidate(createTaskSchema), controller.createTask);
router.put("/:id", authenticate, zodValidate(updateTaskSchema), controller.updateTask);
router.delete("/:id", authenticate, zodValidate(idParamSchema), controller.deleteTask);

export default router;
