import { RequestName } from "../enum";

export const SubjectMail = new Map<RequestName, string>([
  [RequestName.VERIFY_MAIL, "Verify email"],
  [RequestName.RESET_PASSWORD, "Reset password"],
]);
