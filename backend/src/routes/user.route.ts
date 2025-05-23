import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { zodValidate } from "../middlewares/zodValidate.middleware";
import {
  createUserSchema,
  idParamSchema,
  updateUserSchema
} from "../schemas/user.schema";

const router = Router();
const controller = new UserController();

router.get("/", authenticate, controller.getAllUsers);
router.get("/:id", authenticate, zodValidate(idParamSchema), controller.getUserById);
router.get("/email/:email", authenticate, controller.getUserByEmail);
router.post("/", authenticate, zodValidate(createUserSchema), controller.createUser);
router.put("/:id", authenticate, zodValidate(updateUserSchema), controller.updateUser);
router.delete("/:id", authenticate, zodValidate(idParamSchema), controller.deleteUser);

export default router;
