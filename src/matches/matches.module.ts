import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MatchesController } from './matches.controller.js';
import { MatchesService } from './matches.service.js';
import { MatchesRepository } from './matches.repository.js';
import { TeamSplitterService } from './team-splitter.service.js';
import { Match, MatchSchema } from './schemas/match.schema.js';
import { TeamLineup, TeamLineupSchema } from './schemas/team-lineup.schema.js';
import { UsersModule } from '../users/users.module.js';
import { FundsModule } from '../funds/funds.module.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Match.name, schema: MatchSchema },
      { name: TeamLineup.name, schema: TeamLineupSchema },
    ]),
    forwardRef(() => UsersModule),
    forwardRef(() => FundsModule),
  ],
  controllers: [MatchesController],
  providers: [MatchesService, MatchesRepository, TeamSplitterService],
  exports: [MatchesService, MatchesRepository],
})
export class MatchesModule {}
