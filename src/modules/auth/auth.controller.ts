import type { Request } from "express";
import type { LoginBody } from "./auth.schema.js";
import type { AuthService } from "./auth.service.js";

export class AuthController {
  service: AuthService;
  constructor(service: AuthService) {
    this.service = service;
  }
  login = async (req: Request<unknown, unknown, LoginBody>) => {
    const { email, password } = req.body;
    const ipAddress = req.ip || "undefined";
    const userAgent = req.get("user-agent") || "undefined";

    await this.service.loginUser(
      {
        email,
        password,
      },
      ipAddress,
      userAgent
    );
  };
}
