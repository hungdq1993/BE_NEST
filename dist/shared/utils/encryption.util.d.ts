export declare function hashPassword(password: string): Promise<string>;
export declare function comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean>;
export declare function generateRandomToken(length?: number): string;
export declare function generateSecureCode(length?: number): string;
export declare function sha256Hash(data: string): string;
export declare function createHmacSignature(data: string, secret: string, algorithm?: string): string;
export declare function verifyHmacSignature(data: string, signature: string, secret: string, algorithm?: string): boolean;
export declare function maskEmail(email: string): string;
export declare function maskPhone(phone: string): string;
