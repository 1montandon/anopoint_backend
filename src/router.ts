import { Router } from "express";
import authRouter from "./modules/auth/auth.routes.js";

const router = Router({ mergeParams: true });

router.use("/auth", authRouter);

export default router;
