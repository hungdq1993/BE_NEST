import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VotesController } from './votes.controller.js';
import { VotesService } from './votes.service.js';
import { VotesRepository } from './votes.repository.js';
import {
  VoteSession,
  VoteSessionSchema,
} from './schemas/vote-session.schema.js';
import {
  VoteResponse,
  VoteResponseSchema,
} from './schemas/vote-response.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: VoteSession.name, schema: VoteSessionSchema },
      { name: VoteResponse.name, schema: VoteResponseSchema },
    ]),
  ],
  controllers: [VotesController],
  providers: [VotesService, VotesRepository],
  exports: [VotesService],
})
export class VotesModule {}
