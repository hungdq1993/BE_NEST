import {
  Injectable,
  UnauthorizedException,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  initializeFirebase,
  getFirebaseAuth,
} from '../../config/firebase.config.js';

export interface FirebaseUserInfo {
  uid: string;
  email: string | null;
  name: string | null;
  picture: string | null;
  provider: string;
}

@Injectable()
export class FirebaseAuthService implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    try {
      initializeFirebase(this.configService);
    } catch (error: any) {
      console.warn(
        'Firebase initialization skipped:',
        (error as Error).message,
      );
    }
  }

  async verifyIdToken(idToken: string): Promise<FirebaseUserInfo> {
    try {
      const auth = getFirebaseAuth();
      const decodedToken = await auth.verifyIdToken(idToken);

      // Get provider info
      const provider = decodedToken.firebase?.sign_in_provider || 'unknown';

      return {
        uid: decodedToken.uid,
        email: decodedToken.email || null,
        name: decodedToken.name as string | null,
        picture: decodedToken.picture || null,
        provider: this.normalizeProvider(provider),
      };
    } catch (error: unknown) {
      console.error('Firebase ID token verification error:', error);
      throw new UnauthorizedException('Invalid Firebase ID token');
    }
  }

  private normalizeProvider(provider: string): string {
    switch (provider) {
      case 'google.com':
        return 'google';
      case 'facebook.com':
        return 'facebook';
      case 'password':
        return 'email';
      default:
        return provider;
    }
  }
}
