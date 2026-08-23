import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import HttpError from "../../error/error.js";
import type { AuthRepository } from "./auth.repository.js";
import type { LoginInput } from "./auth.schema.js";
import { signAccessToken, signRefreshToken } from "./auth.token.js";

export class AuthService {
  authRepository: AuthRepository;
  constructor(auth: AuthRepository) {
    this.authRepository = auth;
  }
  async loginUser(input: LoginInput, ipAddress: string, userAgent: string) {
    const user = await this.authRepository.findByEmail(input.email);

    if (!user) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, "Invalid credentials");
    }

    const validPassword = await bcrypt.compare(
      input.password,
      user.passwordHash
    );

    if (!validPassword) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, "Invalid credentials");
    }

    const accessToken = signAccessToken(user.id, user.restaurantId);
    const createdRefreshToken = await this.authRepository.createRefreshToken(
      user.id,
      new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      ipAddress,
      userAgent
    );
    const refreshToken = signRefreshToken(user.id, createdRefreshToken.id);

    return { accessToken, refreshToken };
  }
}
