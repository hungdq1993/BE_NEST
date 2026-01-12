import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
export declare const initializeFirebase: (configService: ConfigService) => admin.app.App;
export declare const getFirebaseAuth: () => admin.auth.Auth;
