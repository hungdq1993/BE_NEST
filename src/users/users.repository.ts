import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const user = new this.userModel(createUserDto);
    return user.save();
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find({ isActive: true }).exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument | null> {
    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<UserDocument | null> {
    return this.userModel
      .findByIdAndUpdate(id, { isActive: false }, { new: true })
      .exec();
  }

  async findByFirebaseUid(firebaseUid: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ firebaseUid }).exec();
  }

  async bulkUpdateStudentStatus(
    userIds: string[],
    isStudent: boolean,
  ): Promise<UserDocument[]> {
    await this.userModel.updateMany(
      { _id: { $in: userIds } },
      { $set: { isStudent } },
    );
    return this.userModel.find({ _id: { $in: userIds } }).exec();
  }

  async bulkUpdateSkillLevel(
    userIds: string[],
    skillLevel: number,
  ): Promise<UserDocument[]> {
    await this.userModel.updateMany(
      { _id: { $in: userIds } },
      { $set: { skillLevel } },
    );
    return this.userModel.find({ _id: { $in: userIds } }).exec();
  }
}
