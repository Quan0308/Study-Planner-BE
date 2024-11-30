import { FirebaseAuthService } from "@app/shared-modules/firebase";
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-custom";

@Injectable()
export class FirebaseStrategy extends PassportStrategy(Strategy, "firebase-jwt") {
  constructor(private firebaseService: FirebaseAuthService) {
    super();
  }
  async validate(request: Request) {
    const authHeader = String(request.headers["authorization"] || "");

    if (!authHeader.startsWith("Bearer ")) {
      return false;
    }

    if (authHeader.startsWith("Bearer ") && authHeader.length <= 7) {
      return false;
    }

    const token = authHeader.substring(7, authHeader.length);
    try {
      const decodedToken = await this.firebaseService.verifyCustomToken(token);
      return decodedToken.data;
    } catch (error) {
      return false;
    }
  }
}
