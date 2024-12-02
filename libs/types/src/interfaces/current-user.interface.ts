import { UserRole } from "../enum";

export interface ICurrentUser {
  userId: string;
  role: UserRole;
}
