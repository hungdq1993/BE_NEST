export interface UserPayload {
    _id: string;
    email: string;
    name: string;
    role: string;
}
export declare const CurrentUser: (...dataOrPipes: (keyof UserPayload | import("@nestjs/common").PipeTransform<any, any> | import("@nestjs/common").Type<import("@nestjs/common").PipeTransform<any, any>> | undefined)[]) => ParameterDecorator;
