import { Router } from "express";
import { authMiddleware } from "../../middleware/auth-middleware.js";
import { validateData } from "../../middleware/validation-middleware.js";
import { AuthController } from "./auth.controller.js";
import { AuthRepository } from "./auth.repository.js";
import { loginSchema, refreshTokenSchema } from "./auth.schema.js";
import { AuthService } from "./auth.service.js";

const authRouter = Router();
const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);

authRouter.post("/", validateData(loginSchema), authController.login);
authRouter.post(
  "/logout",
  validateData(refreshTokenSchema),
  authController.logout
);
authRouter.post(
  "/refresh",
  validateData(refreshTokenSchema),
  authController.refresh
);
authRouter.get("/me", authMiddleware, authController.getMe);

export default authRouter;
