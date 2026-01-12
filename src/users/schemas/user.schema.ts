import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from '../../common/decorators/roles.decorator';

export type UserDocument = HydratedDocument<User> & {
  createdAt: Date;
  updatedAt: Date;
};

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop({ type: String, enum: Role, default: Role.PLAYER })
  role: Role;

  @Prop({ type: Number, min: 1, max: 10, default: 5 })
  skillLevel: number;

  @Prop()
  avatar?: string;

  @Prop()
  firebaseUid?: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Index for faster email lookups
UserSchema.index({ email: 1 });

// Index for Firebase UID lookups
UserSchema.index({ firebaseUid: 1 }, { sparse: true });
