import bcrypt from "bcryptjs";
import { HashPassword, ComparePassword } from "@/contracts/gateways";

export class BcryptHandler implements HashPassword, ComparePassword {
  async hash(input: HashPassword.Input): Promise<string> {
    return await bcrypt.hash(input.password, 6);
  }

  async compare(input: ComparePassword.Input): Promise<boolean> {
    return await bcrypt.compare(input.password, input.hashedPassword);
  }
}
