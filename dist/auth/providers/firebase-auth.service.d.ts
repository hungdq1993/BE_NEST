import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export interface FirebaseUserInfo {
    uid: string;
    email: string | null;
    name: string | null;
    picture: string | null;
    provider: string;
}
export declare class FirebaseAuthService implements OnModuleInit {
    private readonly configService;
    constructor(configService: ConfigService);
    onModuleInit(): void;
    verifyIdToken(idToken: string): Promise<FirebaseUserInfo>;
    private normalizeProvider;
}
