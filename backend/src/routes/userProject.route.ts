import { Router } from "express";
import { UserProjectController } from "../controllers/userProject.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { zodValidate } from "../middlewares/zodValidate.middleware";
import {
  createUserProjectSchema,
  idParamSchema,
  updateUserProjectSchema
} from "../schemas/userProject.schema";

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
