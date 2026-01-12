"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseAuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const firebase_config_js_1 = require("../../config/firebase.config.js");
let FirebaseAuthService = class FirebaseAuthService {
    configService;
    constructor(configService) {
        this.configService = configService;
    }
    onModuleInit() {
        try {
            (0, firebase_config_js_1.initializeFirebase)(this.configService);
        }
        catch (error) {
            console.warn('Firebase initialization skipped:', error.message);
        }
    }
    async verifyIdToken(idToken) {
        try {
            const auth = (0, firebase_config_js_1.getFirebaseAuth)();
            const decodedToken = await auth.verifyIdToken(idToken);
            const provider = decodedToken.firebase?.sign_in_provider || 'unknown';
            return {
                uid: decodedToken.uid,
                email: decodedToken.email || null,
                name: decodedToken.name,
                picture: decodedToken.picture || null,
                provider: this.normalizeProvider(provider),
            };
        }
        catch (error) {
            console.error('Firebase ID token verification error:', error);
            throw new common_1.UnauthorizedException('Invalid Firebase ID token');
        }
    }
    normalizeProvider(provider) {
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
};
exports.FirebaseAuthService = FirebaseAuthService;
exports.FirebaseAuthService = FirebaseAuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], FirebaseAuthService);
//# sourceMappingURL=firebase-auth.service.js.map