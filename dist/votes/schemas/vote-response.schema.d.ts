import { HydratedDocument, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema.js';
import { VoteSession } from './vote-session.schema.js';
export declare enum VoteChoice {
    YES = "yes",
    NO = "no",
    MAYBE = "maybe"
}
export type VoteResponseDocument = HydratedDocument<VoteResponse> & {
    createdAt: Date;
    updatedAt: Date;
};
export declare class VoteResponse {
    session: VoteSession | Types.ObjectId;
    user: User | Types.ObjectId;
    choice: VoteChoice;
    note?: string;
}
export declare const VoteResponseSchema: import("mongoose").Schema<VoteResponse, import("mongoose").Model<VoteResponse, any, any, any, (import("mongoose").Document<unknown, any, VoteResponse, any, import("mongoose").DefaultSchemaOptions> & VoteResponse & {
    _id: Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (import("mongoose").Document<unknown, any, VoteResponse, any, import("mongoose").DefaultSchemaOptions> & VoteResponse & {
    _id: Types.ObjectId;
} & {
    __v: number;
}), any, VoteResponse>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, VoteResponse, import("mongoose").Document<unknown, {}, VoteResponse, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<VoteResponse & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    session?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | VoteSession, VoteResponse, import("mongoose").Document<unknown, {}, VoteResponse, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<VoteResponse & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    user?: import("mongoose").SchemaDefinitionProperty<User | Types.ObjectId, VoteResponse, import("mongoose").Document<unknown, {}, VoteResponse, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<VoteResponse & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    choice?: import("mongoose").SchemaDefinitionProperty<VoteChoice, VoteResponse, import("mongoose").Document<unknown, {}, VoteResponse, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<VoteResponse & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    note?: import("mongoose").SchemaDefinitionProperty<string | undefined, VoteResponse, import("mongoose").Document<unknown, {}, VoteResponse, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<VoteResponse & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, VoteResponse>;
