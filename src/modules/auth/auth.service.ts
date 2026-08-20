import type { AuthRepository } from "./auth.repository.js";
import type { LoginInput } from "./auth.schema.js";

export class AuthService {
  authRepository: AuthRepository;
  constructor(auth: AuthRepository) {
    this.authRepository = auth;
  }
  async loginUser(input: LoginInput) {
    const usuario = await this.authRepository.findByEmail(input.email);

    if (!usuario) {
      throw new Error("Credenciais Invalidas");
    }
  }
}
