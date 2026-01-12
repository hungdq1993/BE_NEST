import { Model } from 'mongoose';
import { UserDocument } from './schemas/user.schema.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
export declare class UsersRepository {
    private readonly userModel;
    constructor(userModel: Model<UserDocument>);
    create(createUserDto: CreateUserDto): Promise<UserDocument>;
    findAll(): Promise<UserDocument[]>;
    findById(id: string): Promise<UserDocument | null>;
    findByEmail(email: string): Promise<UserDocument | null>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<UserDocument | null>;
    delete(id: string): Promise<UserDocument | null>;
    findByFirebaseUid(firebaseUid: string): Promise<UserDocument | null>;
}
