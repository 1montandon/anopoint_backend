import bcrypt from "bcrypt";
import type { AuthRepository } from "./auth.repository.js";
import type { LoginInput } from "./auth.schema.js";
import { signAccessToken } from "./auth.token.js";

export class AuthService {
  authRepository: AuthRepository;
  constructor(auth: AuthRepository) {
    this.authRepository = auth;
  }
  async loginUser(input: LoginInput) {
    const user = await this.authRepository.findByEmail(input.email);

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const validPassword = await bcrypt.compare(
      input.password,
      user.passwordHash
    );

    if (!validPassword) {
      throw new Error("Invalid credentials");
    }

    const accessToken = signAccessToken(user.id, user.restaurantId);
    

    console.log(accessToken);
  }
}
