import { HydratedDocument, Types } from 'mongoose';
import { Match } from './match.schema.js';
import { User } from '../../users/schemas/user.schema.js';
export type TeamLineupDocument = HydratedDocument<TeamLineup> & {
    createdAt: Date;
    updatedAt: Date;
};
export declare class TeamLineup {
    match: Match | Types.ObjectId;
    team: 'A' | 'B';
    players: (User | Types.ObjectId)[];
    totalSkillLevel: number;
}
export declare const TeamLineupSchema: import("mongoose").Schema<TeamLineup, import("mongoose").Model<TeamLineup, any, any, any, (import("mongoose").Document<unknown, any, TeamLineup, any, import("mongoose").DefaultSchemaOptions> & TeamLineup & {
    _id: Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (import("mongoose").Document<unknown, any, TeamLineup, any, import("mongoose").DefaultSchemaOptions> & TeamLineup & {
    _id: Types.ObjectId;
} & {
    __v: number;
}), any, TeamLineup>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, TeamLineup, import("mongoose").Document<unknown, {}, TeamLineup, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<TeamLineup & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    match?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | Match, TeamLineup, import("mongoose").Document<unknown, {}, TeamLineup, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<TeamLineup & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    team?: import("mongoose").SchemaDefinitionProperty<"A" | "B", TeamLineup, import("mongoose").Document<unknown, {}, TeamLineup, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<TeamLineup & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    players?: import("mongoose").SchemaDefinitionProperty<(User | Types.ObjectId)[], TeamLineup, import("mongoose").Document<unknown, {}, TeamLineup, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<TeamLineup & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    totalSkillLevel?: import("mongoose").SchemaDefinitionProperty<number, TeamLineup, import("mongoose").Document<unknown, {}, TeamLineup, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<TeamLineup & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, TeamLineup>;
