import { HydratedDocument, Types } from 'mongoose';
import { VoteSession } from '../../votes/schemas/vote-session.schema.js';
export declare enum MatchStatus {
    SCHEDULED = "scheduled",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
export type MatchDocument = HydratedDocument<Match> & {
    createdAt: Date;
    updatedAt: Date;
};
export declare class Match {
    matchDate: Date;
    location: string;
    status: MatchStatus;
    voteSession?: VoteSession | Types.ObjectId;
    result?: {
        teamAScore: number;
        teamBScore: number;
    };
    matchFee: number;
    notes?: string;
}
export declare const MatchSchema: import("mongoose").Schema<Match, import("mongoose").Model<Match, any, any, any, (import("mongoose").Document<unknown, any, Match, any, import("mongoose").DefaultSchemaOptions> & Match & {
    _id: Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (import("mongoose").Document<unknown, any, Match, any, import("mongoose").DefaultSchemaOptions> & Match & {
    _id: Types.ObjectId;
} & {
    __v: number;
}), any, Match>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Match, import("mongoose").Document<unknown, {}, Match, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Match & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    matchDate?: import("mongoose").SchemaDefinitionProperty<Date, Match, import("mongoose").Document<unknown, {}, Match, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Match & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    location?: import("mongoose").SchemaDefinitionProperty<string, Match, import("mongoose").Document<unknown, {}, Match, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Match & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<MatchStatus, Match, import("mongoose").Document<unknown, {}, Match, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Match & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    voteSession?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | VoteSession | undefined, Match, import("mongoose").Document<unknown, {}, Match, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Match & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    result?: import("mongoose").SchemaDefinitionProperty<{
        teamAScore: number;
        teamBScore: number;
    } | undefined, Match, import("mongoose").Document<unknown, {}, Match, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Match & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    matchFee?: import("mongoose").SchemaDefinitionProperty<number, Match, import("mongoose").Document<unknown, {}, Match, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Match & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    notes?: import("mongoose").SchemaDefinitionProperty<string | undefined, Match, import("mongoose").Document<unknown, {}, Match, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Match & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Match>;
