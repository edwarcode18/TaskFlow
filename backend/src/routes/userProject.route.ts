import { Router } from "express";
import { UserProjectController } from "../controllers/userProject.controller";
import { zodValidate } from "../middlewares/zodValidate.middleware";
import {
  createUserProjectSchema,
  updateUserProjectSchema,
  idParamSchema
} from "../schemas/userProject.schema";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();
const controller = new UserProjectController();

router.get("/", authenticate, controller.getAllUserProjects);
router.get(
  "/:id",
  authenticate,
  zodValidate(idParamSchema),
  controller.getUserProjectById
);
router.post(
  "/",
  authenticate,
  zodValidate(createUserProjectSchema),
  controller.createUserProject
);
router.put(
  "/:id",
  authenticate,
  zodValidate(updateUserProjectSchema),
  controller.updateUserProject
);
router.delete(
  "/:id",
  authenticate,
  zodValidate(idParamSchema),
  controller.deleteUserProject
);

export default router;
