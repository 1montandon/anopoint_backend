import type { Request, Response } from "express";
import type { LoginBody } from "./auth.schema.js";
import type { AuthService } from "./auth.service.js";

export class AuthController {
  service: AuthService;
  constructor(service: AuthService) {
    this.service = service;
  }
  login = async (req: Request<unknown, unknown, LoginBody>, res: Response) => {
    const { email, password } = req.body;

    const result = await this.service.loginUser({
      email,
      password,
    });
  };
}
