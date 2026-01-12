import { VoteChoice } from '../schemas/vote-response.schema.js';
export declare class SubmitVoteDto {
    sessionId: string;
    choice: VoteChoice;
    note?: string;
}
