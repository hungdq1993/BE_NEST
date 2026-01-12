import { HydratedDocument, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema.js';
import { Match } from '../../matches/schemas/match.schema.js';
export declare enum PenaltyReason {
    LATE_ARRIVAL = "late_arrival",
    NO_SHOW = "no_show",
    LATE_CANCELLATION = "late_cancellation",
    OTHER = "other"
}
export type PenaltyDocument = HydratedDocument<Penalty> & {
    createdAt: Date;
    updatedAt: Date;
};
export declare class Penalty {
    user: User | Types.ObjectId;
    match: Match | Types.ObjectId;
    amount: number;
    reason: PenaltyReason;
    description?: string;
    isPaid: boolean;
    paidAt?: Date;
}
export declare const PenaltySchema: import("mongoose").Schema<Penalty, import("mongoose").Model<Penalty, any, any, any, (import("mongoose").Document<unknown, any, Penalty, any, import("mongoose").DefaultSchemaOptions> & Penalty & {
    _id: Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (import("mongoose").Document<unknown, any, Penalty, any, import("mongoose").DefaultSchemaOptions> & Penalty & {
    _id: Types.ObjectId;
} & {
    __v: number;
}), any, Penalty>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Penalty, import("mongoose").Document<unknown, {}, Penalty, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Penalty & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    user?: import("mongoose").SchemaDefinitionProperty<User | Types.ObjectId, Penalty, import("mongoose").Document<unknown, {}, Penalty, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Penalty & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    match?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | Match, Penalty, import("mongoose").Document<unknown, {}, Penalty, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Penalty & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    amount?: import("mongoose").SchemaDefinitionProperty<number, Penalty, import("mongoose").Document<unknown, {}, Penalty, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Penalty & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    reason?: import("mongoose").SchemaDefinitionProperty<PenaltyReason, Penalty, import("mongoose").Document<unknown, {}, Penalty, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Penalty & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    description?: import("mongoose").SchemaDefinitionProperty<string | undefined, Penalty, import("mongoose").Document<unknown, {}, Penalty, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Penalty & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isPaid?: import("mongoose").SchemaDefinitionProperty<boolean, Penalty, import("mongoose").Document<unknown, {}, Penalty, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Penalty & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    paidAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, Penalty, import("mongoose").Document<unknown, {}, Penalty, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Penalty & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Penalty>;
