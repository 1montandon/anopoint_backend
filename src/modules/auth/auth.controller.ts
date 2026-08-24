import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import HttpError from "../../error/error.js";
import type { AuthRequest } from "../../middleware/auth-middleware.js";
import type { LoginInput } from "./auth.schema.js";
import type {
  AuthService,
  LoginResult,
  PublicUser,
  TokenPair,
} from "./auth.service.js";

type NoParams = Record<string, never>;

export class AuthController {
  private readonly service: AuthService;

  constructor(service: AuthService) {
    this.service = service;
  }

  login = async (
    req: Request<NoParams, LoginResult, LoginInput>,
    res: Response<LoginResult>
  ): Promise<void> => {
    const result = await this.service.login(
      req.body,
      req.ip,
      req.get("user-agent")
    );

    res.status(StatusCodes.OK).json(result);
  };

  logout = async (req: Request, res: Response<void>): Promise<void> => {
    await this.service.logout(req.cookies.refreshToken);
    res.status(StatusCodes.NO_CONTENT).send();
  };

  refresh = async (req: Request, res: Response<TokenPair>): Promise<void> => {
    const result = await this.service.refresh(
      req.cookies.refreshToken,
      req.ip,
      req.get("user-agent")
    );

    res.status(StatusCodes.OK).json(result);
  };

  getMe = async (
    req: AuthRequest,
    res: Response<PublicUser>
  ): Promise<void> => {
    if (typeof req.userId !== "number") {
      throw new HttpError(StatusCodes.UNAUTHORIZED, "Unauthorized");
    }

    const user = await this.service.getMe(req.userId);
    res.status(StatusCodes.OK).json(user);
  };
}
