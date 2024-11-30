import { genericHttpConsumer } from "@app/utils/axios";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AxiosInstance } from "axios";
import { AppOptions } from "firebase-admin";
import { App, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

@Injectable()
export class FirebaseAuthService {
  private readonly logger = new Logger(this.constructor.name);
  private readonly app: App;
  private readonly apiKey: string;
  private readonly firebaseUrl: string;
  private readonly requestUri: string;
  private readonly httpService: AxiosInstance;

  constructor(
    @Inject("FIREBASE_ADMIN_OPTIONS_TOKEN") readonly options: AppOptions,
    private readonly configService: ConfigService
  ) {
    this.apiKey = this.configService.get("FIREBASE_API_KEY");
    this.firebaseUrl = this.configService.get("FIREBASE_URL");
    this.requestUri = this.configService.get("REQUEST_URI");
    this.httpService = genericHttpConsumer();
    this.app = initializeApp(options);
  }

  async createUserByEmailAndPassword(email: string, password: string, emailVerified: boolean) {
    try {
      const auth = getAuth(this.app);
      return await auth.createUser({ email, password, emailVerified });
    } catch (error) {
      if (error.code === "auth/email-already-exists") {
        throw new Error("Email already exists");
      }
      this.logger.error(error);
      throw error;
    }
  }

  async getUserByEmail(email: string, nullIfNotFound?: boolean) {
    try {
      const auth = getAuth(this.app);
      return await auth.getUserByEmail(email);
    } catch (error) {
      if (nullIfNotFound && error.code === "auth/user-not-found") {
        return null;
      }
      throw error;
    }
  }

  async generateCustomToken(uid: string, data: any) {
    const additionalClaims = data ? { data } : {};
    return getAuth(this.app).createCustomToken(uid, additionalClaims);
  }

  async verifyUser(email: string, password: string) {
    try {
      const response = await this.httpService.post(
        `${this.firebaseUrl}/accounts:signInWithPassword?key=${this.apiKey}`,
        {
          email,
          password,
          returnSecureToken: true,
        }
      );
      return response.data;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async verifyOAuthCredential(credential: string, providerId: string) {
    try {
      const response = await this.httpService.post(`${this.firebaseUrl}/accounts:signInWithIdp?key=${this.apiKey}`, {
        requestUri: this.requestUri,
        postBody: `id_token=${credential}&providerId=${providerId}`,
        returnSecureToken: true,
      });
      return response.data;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async verifyCustomToken(token: string) {
    try {
      const idToken = await this.getIdToken(token);
      const auth = getAuth(this.app);
      return auth.verifyIdToken(idToken);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async setEmailVerifed(uid: string) {
    try {
      const auth = getAuth(this.app);
      await auth.updateUser(uid, {
        emailVerified: true,
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async linkWithProvider(idToken: string, email: string, password: string) {
    try {
      const response = await this.httpService.post(`${this.firebaseUrl}/accounts:update?key=${this.apiKey}`, {
        idToken,
        email,
        password,
        returnSecureToken: false,
      });
      return response.data;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getIdToken(token: string) {
    try {
      const response = await this.httpService.post(
        `${this.firebaseUrl}/accounts:signInWithCustomToken?key=${this.apiKey}`,
        {
          token,
          returnSecureToken: true,
        }
      );
      return response.data.idToken;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async changePassword(uid: string, newPassword: string) {
    try {
      const app = getAuth(this.app);
      return app.updateUser(uid, {
        password: newPassword,
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      const response = await this.httpService.post(`${this.firebaseUrl}/token?key=${this.apiKey}`, {
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      });
      return response.data;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async revokeRefreshToken(uid: string) {
    try {
      const auth = getAuth(this.app);
      await auth.revokeRefreshTokens(uid);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
