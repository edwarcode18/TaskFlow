import { Router } from "express";
import { ProjectController } from "../controllers/project.controller";
import { zodValidate } from "../middlewares/zodValidate.middleware";
import {
  createProjectSchema,
  updateProjectSchema,
  idParamSchema
} from "../schemas/project.schema";

const router = Router();
const controller = new ProjectController();

router.get("/", controller.getAllProjects);
router.get("/:id", zodValidate(idParamSchema), controller.getProjectById);
router.post("/", zodValidate(createProjectSchema), controller.createProject);
router.put("/:id", zodValidate(updateProjectSchema), controller.updateProject);
router.delete("/:id", zodValidate(idParamSchema), controller.deleteProject);

export default router;
