import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  VoteSession,
  VoteSessionDocument,
  VoteStatus,
} from './schemas/vote-session.schema.js';
import {
  VoteResponse,
  VoteResponseDocument,
  VoteChoice,
} from './schemas/vote-response.schema.js';
import { CreateVoteSessionDto } from './dto/create-vote-session.dto.js';

@Injectable()
export class VotesRepository {
  constructor(
    @InjectModel(VoteSession.name)
    private readonly voteSessionModel: Model<VoteSessionDocument>,
    @InjectModel(VoteResponse.name)
    private readonly voteResponseModel: Model<VoteResponseDocument>,
  ) {}

  // Vote Session methods
  async createSession(
    createDto: CreateVoteSessionDto,
    createdBy: string,
  ): Promise<VoteSessionDocument> {
    const session = new this.voteSessionModel({
      ...createDto,
      matchDate: new Date(createDto.matchDate),
      deadline: new Date(createDto.deadline),
      createdBy: new Types.ObjectId(createdBy),
    });
    return session.save();
  }

  async findAllSessions(): Promise<VoteSessionDocument[]> {
    return this.voteSessionModel
      .find()
      .populate('createdBy', 'name email')
      .sort({ matchDate: -1 })
      .exec();
  }

  async findSessionById(id: string): Promise<VoteSessionDocument | null> {
    return this.voteSessionModel
      .findById(id)
      .populate('createdBy', 'name email')
      .exec();
  }

  async findOpenSessions(): Promise<VoteSessionDocument[]> {
    return this.voteSessionModel
      .find({ status: VoteStatus.OPEN })
      .populate('createdBy', 'name email')
      .sort({ deadline: 1 })
      .exec();
  }

  async updateSessionStatus(
    id: string,
    status: VoteStatus,
  ): Promise<VoteSessionDocument | null> {
    return this.voteSessionModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .exec();
  }

  async deleteSession(id: string): Promise<VoteSessionDocument | null> {
    return this.voteSessionModel.findByIdAndDelete(id).exec();
  }

  // Vote Response methods
  async submitVote(
    sessionId: string,
    userId: string,
    choice: VoteChoice,
    note?: string,
  ): Promise<VoteResponseDocument> {
    const existingVote = await this.voteResponseModel.findOne({
      session: new Types.ObjectId(sessionId),
      user: new Types.ObjectId(userId),
    });

    if (existingVote) {
      existingVote.choice = choice;
      existingVote.note = note;
      return existingVote.save();
    }

    const vote = new this.voteResponseModel({
      session: new Types.ObjectId(sessionId),
      user: new Types.ObjectId(userId),
      choice,
      note,
    });
    return vote.save();
  }

  async findVotesBySession(sessionId: string): Promise<VoteResponseDocument[]> {
    return this.voteResponseModel
      .find({ session: new Types.ObjectId(sessionId) })
      .populate('user', 'name email skillLevel')
      .exec();
  }

  async findUserVote(
    sessionId: string,
    userId: string,
  ): Promise<VoteResponseDocument | null> {
    return this.voteResponseModel
      .findOne({
        session: new Types.ObjectId(sessionId),
        user: new Types.ObjectId(userId),
      })
      .exec();
  }

  async countVotesByChoice(
    sessionId: string,
  ): Promise<{ choice: VoteChoice; count: number }[]> {
    return this.voteResponseModel.aggregate([
      { $match: { session: new Types.ObjectId(sessionId) } },
      { $group: { _id: '$choice', count: { $sum: 1 } } },
      { $project: { choice: '$_id', count: 1, _id: 0 } },
    ]);
  }

  async deleteVotesBySession(sessionId: string): Promise<void> {
    await this.voteResponseModel
      .deleteMany({ session: new Types.ObjectId(sessionId) })
      .exec();
  }
}
