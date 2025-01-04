import { BadRequestException, Injectable, Logger, NotAcceptableException } from "@nestjs/common";
import { FirebaseAuthService } from "@app/shared-modules/firebase";
import { RequestRepository, UserRepository } from "@app/database/repositories";
import { User } from "@app/database/entities";
import { generate as otpGenerator } from "otp-generator";
import { generateOTPConfig, generatePasswordConfig } from "../../config";
import { RequestName } from "@app/types/enum";
import { MailService } from "@app/shared-modules/mail/mail.service";
import { SubjectMail } from "@app/types/maps";
@Injectable()
export class AuthService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly firebaseService: FirebaseAuthService,
    private userRepository: UserRepository,
    private requestRepository: RequestRepository,
    private mailService: MailService
  ) {}

  async registerUser(email: string, password: string) {
    try {
      const firebaseUser = await this.firebaseService.createUserByEmailAndPassword(email, password, false);
      await this.userRepository.create({ email, uid: firebaseUser.uid, username: email });
      await this.sendOtp(email, RequestName.VERIFY_MAIL);
      return "Sign up successfully";
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async loginWithProvider(credential: string, provider: string) {
    try {
      const firebaseUser = await this.firebaseService.verifyOAuthCredential(credential, provider);
      const { email } = firebaseUser;
      let dbUser: User = await this.userRepository.findOne({ email });
      if (!dbUser) {
        const generatedPassword = otpGenerator(8, generatePasswordConfig);
        await this.firebaseService.linkWithProvider(firebaseUser.idToken, firebaseUser.email, generatedPassword);
        dbUser = await this.userRepository.create({ email, uid: firebaseUser.uid, username: email, isVerified: true });
      } else {
        await this.firebaseService.setEmailVerifed(dbUser.uid);
        dbUser = await this.userRepository.findOneAndUpate({ _id: dbUser._id }, { isVerified: true });
      }
      const claims = { userId: dbUser._id, role: dbUser.role };
      const accessToken = await this.firebaseService.generateCustomToken(dbUser.uid, claims);
      return this.buildTokenResponse(accessToken, firebaseUser.refreshToken);
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async login(email: string, password: string) {
    try {
      const firebaseUser = await this.firebaseService.verifyUser(email, password);
      const dbUser = await this.userRepository.findOne({ email });
      if (!dbUser.isVerified) {
        await this.sendOtp(email, RequestName.VERIFY_MAIL);
        return "You have not verified email";
      }
      const accessToken = await this.firebaseService.generateCustomToken(dbUser.uid, {
        userId: dbUser._id,
        role: dbUser.role,
      });
      return this.buildTokenResponse(accessToken, firebaseUser.refreshToken);
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async sendOtp(email: string, requestName: RequestName) {
    try {
      const dbUser = await this.userRepository.findOne({ email });
      if (!dbUser) {
        throw new NotAcceptableException("Email not found");
      }
      const otp = otpGenerator(6, generateOTPConfig);
      const verifyToken = await this.firebaseService.generateCustomToken(dbUser.uid, {
        userId: dbUser._id,
        uid: dbUser.uid,
        requestName,
      });

      await this.requestRepository.findAllAndUpdate(
        { userId: dbUser._id.toString, name: requestName },
        { status: false }
      );
      const saved = await this.requestRepository.create({
        userId: dbUser._id.toString(),
        verifyData: otp,
        token: verifyToken,
        name: requestName,
      });

      if (saved) {
        const res = await this.mailService.sendMail(dbUser.email, SubjectMail.get(requestName), requestName, { otp });
        return res.accepted.length > 0;
      }
      return false;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async verifyOtp(email: string, otp: string, requestName: RequestName) {
    try {
      const dbUser = await this.userRepository.findOne({ email });
      const request = await this.requestRepository.findOne({
        userId: dbUser._id.toString,
        name: requestName,
        status: true,
      });
      if (new Date() > new Date(request.exp) || request.status === false) {
        await this.requestRepository.findOneAndUpate({ _id: request._id }, { status: false });
        throw new NotAcceptableException("OTP expired");
      }

      if (request.verifyData !== otp) {
        throw new NotAcceptableException("Invalid OTP");
      }

      await this.requestRepository.findOneAndUpate({ _id: request._id }, { status: false });

      return this.buildTokenResponse(request.token);
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async updatePassword(uid: string, newPassword: string) {
    try {
      await this.firebaseService.changePassword(uid, newPassword);
      return "OK";
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async verifyMail(userId: string) {
    try {
      const dbUser = await this.userRepository.findOneAndUpate({ _id: userId }, { isVerified: true });
      await this.firebaseService.setEmailVerifed(dbUser.uid);
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      const firebaseUser = await this.firebaseService.refreshToken(refreshToken);
      const dbUser = await this.userRepository.findOne({ uid: firebaseUser.user_id });
      const accessToken = await this.firebaseService.generateCustomToken(dbUser.uid, {
        userId: dbUser._id,
        role: dbUser.role,
      });
      return this.buildTokenResponse(accessToken, firebaseUser.refresh_token);
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async buildTokenResponse(accessToken: string, refreshToken?: string) {
    return { accessToken, refreshToken };
  }
}
