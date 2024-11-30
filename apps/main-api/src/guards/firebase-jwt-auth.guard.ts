import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class FirebaseJwtAuthGuard extends AuthGuard("firebase-jwt") {}
