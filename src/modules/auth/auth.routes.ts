import { Router } from "express";
import { validateData } from "../../middleware/validationMiddleware.js";
import { AuthController } from "./auth.controller.js";
import { AuthRepository } from "./auth.repository.js";
import { loginSchema } from "./auth.schema.js";
import { AuthService } from "./auth.service.js";

const authRouter = Router();
const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);

authRouter.post("/", validateData(loginSchema), authController.login);

export default authRouter;
