import { Router } from "express";
import { UserProjectController } from "../controllers/userProject.controller";
import { zodValidate } from "../middlewares/zodValidate.middleware";
import {
  createUserProjectSchema,
  updateUserProjectSchema,
  idParamSchema
} from "../schemas/userProject.schema";

const router = Router();
const controller = new UserProjectController();

router.get("/", controller.getAllUserProjects);
router.get("/:id", zodValidate(idParamSchema), controller.getUserProjectById);
router.post(
  "/",
  zodValidate(createUserProjectSchema),
  controller.createUserProject
);
router.put(
  "/:id",
  zodValidate(updateUserProjectSchema),
  controller.updateUserProject
);
router.delete("/:id", zodValidate(idParamSchema), controller.deleteUserProject);

export default router;
