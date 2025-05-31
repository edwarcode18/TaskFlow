import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { zodValidate } from "../middlewares/zodValidate.middleware";
import { loginSchema } from "../schemas/auth.schema";

const router = Router();
const controller = new AuthController();

router.post("/login", zodValidate(loginSchema), controller.login);

export default router;