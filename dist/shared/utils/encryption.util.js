"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.comparePassword = comparePassword;
exports.generateRandomToken = generateRandomToken;
exports.generateSecureCode = generateSecureCode;
exports.sha256Hash = sha256Hash;
exports.createHmacSignature = createHmacSignature;
exports.verifyHmacSignature = verifyHmacSignature;
exports.maskEmail = maskEmail;
exports.maskPhone = maskPhone;
const bcrypt = __importStar(require("bcrypt"));
const crypto = __importStar(require("crypto"));
const SALT_ROUNDS = 10;
async function hashPassword(password) {
    return bcrypt.hash(password, SALT_ROUNDS);
}
async function comparePassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
}
function generateRandomToken(length = 32) {
    return crypto.randomBytes(length).toString('hex');
}
function generateSecureCode(length = 6) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const randomBytes = crypto.randomBytes(length);
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars[randomBytes[i] % chars.length];
    }
    return result;
}
function sha256Hash(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
}
function createHmacSignature(data, secret, algorithm = 'sha256') {
    return crypto.createHmac(algorithm, secret).update(data).digest('hex');
}
function verifyHmacSignature(data, signature, secret, algorithm = 'sha256') {
    const expectedSignature = createHmacSignature(data, secret, algorithm);
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
}
function maskEmail(email) {
    const [localPart, domain] = email.split('@');
    if (!domain)
        return email;
    const maskedLocal = localPart.length <= 2
        ? '*'.repeat(localPart.length)
        : localPart[0] + '*'.repeat(localPart.length - 2) + localPart.slice(-1);
    return `${maskedLocal}@${domain}`;
}
function maskPhone(phone) {
    if (phone.length <= 4)
        return '*'.repeat(phone.length);
    return '*'.repeat(phone.length - 4) + phone.slice(-4);
}
//# sourceMappingURL=encryption.util.js.map