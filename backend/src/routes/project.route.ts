import { Router } from "express";
import { ProjectController } from "../controllers/project.controller";
import { zodValidate } from "../middlewares/zodValidate.middleware";
import {
  createProjectSchema,
  updateProjectSchema,
  idParamSchema
} from "../schemas/project.schema";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();
const controller = new ProjectController();

router.get("/", authenticate, controller.getAllProjects);
router.get("/:id", authenticate, zodValidate(idParamSchema), controller.getProjectById);
router.post("/", authenticate, zodValidate(createProjectSchema), controller.createProject);
router.put("/:id", authenticate, zodValidate(updateProjectSchema), controller.updateProject);
router.delete("/:id", authenticate, zodValidate(idParamSchema), controller.deleteProject);

export default router;
