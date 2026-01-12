import { HydratedDocument, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema.js';
export declare enum VoteStatus {
    OPEN = "open",
    CLOSED = "closed",
    CANCELLED = "cancelled"
}
export type VoteSessionDocument = HydratedDocument<VoteSession> & {
    createdAt: Date;
    updatedAt: Date;
};
export declare class VoteSession {
    matchDate: Date;
    deadline: Date;
    status: VoteStatus;
    createdBy: User | Types.ObjectId;
    description?: string;
    location?: string;
}
export declare const VoteSessionSchema: import("mongoose").Schema<VoteSession, import("mongoose").Model<VoteSession, any, any, any, (import("mongoose").Document<unknown, any, VoteSession, any, import("mongoose").DefaultSchemaOptions> & VoteSession & {
    _id: Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (import("mongoose").Document<unknown, any, VoteSession, any, import("mongoose").DefaultSchemaOptions> & VoteSession & {
    _id: Types.ObjectId;
} & {
    __v: number;
}), any, VoteSession>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, VoteSession, import("mongoose").Document<unknown, {}, VoteSession, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<VoteSession & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    matchDate?: import("mongoose").SchemaDefinitionProperty<Date, VoteSession, import("mongoose").Document<unknown, {}, VoteSession, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<VoteSession & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    deadline?: import("mongoose").SchemaDefinitionProperty<Date, VoteSession, import("mongoose").Document<unknown, {}, VoteSession, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<VoteSession & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<VoteStatus, VoteSession, import("mongoose").Document<unknown, {}, VoteSession, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<VoteSession & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    createdBy?: import("mongoose").SchemaDefinitionProperty<User | Types.ObjectId, VoteSession, import("mongoose").Document<unknown, {}, VoteSession, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<VoteSession & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    description?: import("mongoose").SchemaDefinitionProperty<string | undefined, VoteSession, import("mongoose").Document<unknown, {}, VoteSession, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<VoteSession & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    location?: import("mongoose").SchemaDefinitionProperty<string | undefined, VoteSession, import("mongoose").Document<unknown, {}, VoteSession, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<VoteSession & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, VoteSession>;
