import { User } from "@app/database/entities";
import { UserRepository } from "@app/database/repositories";
import { ICurrentUser } from "@app/types/interfaces";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  getUserProfile(user: ICurrentUser) {
    return this.userRepository.findOne({ _id: user.userId });
  }

  updateUserProfile(user: ICurrentUser, updatedData: Partial<User>) {
    return this.userRepository.findOneAndUpate({ _id: user.userId }, updatedData);
  }
}
