import { Router } from "express";
import { TaskController } from "../controllers/task.controller";
import { zodValidate } from "../middlewares/zodValidate.middleware";
import {
  createTaskSchema,
  updateTaskSchema,
  idParamSchema
} from "../schemas/task.schema";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();
const controller = new TaskController();

router.get("/", authenticate, controller.getAllTask);
router.get("/:id", authenticate, zodValidate(idParamSchema), controller.getTasksById);
router.post("/", authenticate, zodValidate(createTaskSchema), controller.createTask);
router.put("/:id", authenticate, zodValidate(updateTaskSchema), controller.updateTask);
router.delete("/:id", authenticate, zodValidate(idParamSchema), controller.deleteTask);

export default router;
