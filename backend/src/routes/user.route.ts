import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { zodValidate } from "../middlewares/zodValidate.middleware";
import {
  createUserSchema,
  updateUserSchema,
  idParamSchema
} from "../schemas/user.schema";

const router = Router();
const controller = new UserController();

router.get("/", controller.getAllUsers);
router.get("/:id", zodValidate(idParamSchema), controller.getUserById);
router.get("/email/:email", controller.getUserByEmail);
router.post("/", zodValidate(createUserSchema), controller.createUser);
router.put("/:id", zodValidate(updateUserSchema), controller.updateUser);
router.delete("/:id", zodValidate(idParamSchema), controller.deleteUser);

export default router;
