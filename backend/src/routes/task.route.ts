import { Router } from "express";
import { TaskController } from "../controllers/task.controller";
import { zodValidate } from "../middlewares/zodValidate.middleware";
import {
  createTaskSchema,
  updateTaskSchema,
  idParamSchema
} from "../schemas/task.schema";

const router = Router();
const controller = new TaskController();

router.get("/", controller.getAllTask);
router.get("/:id", zodValidate(idParamSchema), controller.getTasksById);
router.post("/", zodValidate(createTaskSchema), controller.createTask);
router.put("/:id", zodValidate(updateTaskSchema), controller.updateTask);
router.delete("/:id", zodValidate(idParamSchema), controller.deleteTask);

export default router;
