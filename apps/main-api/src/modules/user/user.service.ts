import { User } from "@app/database/entities";
import { UserRepository } from "@app/database/repositories";
import { FirebaseAuthService } from "@app/shared-modules/firebase";
import { ICurrentUser } from "@app/types/interfaces";
import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { EntityNotFoundError } from "typeorm";

@Injectable()
export class UserService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private userRepository: UserRepository,
    private firebaseService: FirebaseAuthService
  ) {}

  getUserProfile(user: ICurrentUser) {
    return this.userRepository.findOne({ _id: user.userId });
  }

  updateUserProfile(user: ICurrentUser, updatedData: Partial<User>) {
    return this.userRepository.findOneAndUpate({ _id: user.userId }, updatedData);
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    try {
      const user = await this.userRepository.findOne({ _id: userId });
      const verifiedFirebaseUser = await this.firebaseService.verifyUser(user.email, oldPassword);
      await this.firebaseService.changePassword(verifiedFirebaseUser.localId, newPassword);
      return "Password changed";
    } catch (error) {
      this.logger.error(error);
      if (error.response && error.response === "INVALID_LOGIN_CREDENTIALS") {
        throw new BadRequestException("Invalid old password");
      } else if (error instanceof EntityNotFoundError) {
        throw new BadRequestException("User not found");
      }
      throw new BadRequestException(error);
    }
  }
}
