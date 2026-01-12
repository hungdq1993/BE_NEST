import { HydratedDocument, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema.js';
import { Match } from '../../matches/schemas/match.schema.js';
export type MatchPaymentDocument = HydratedDocument<MatchPayment> & {
    createdAt: Date;
    updatedAt: Date;
};
export declare class MatchPayment {
    user: User | Types.ObjectId;
    match: Match | Types.ObjectId;
    amount: number;
    isPaid: boolean;
    paidAt?: Date;
    note?: string;
}
export declare const MatchPaymentSchema: import("mongoose").Schema<MatchPayment, import("mongoose").Model<MatchPayment, any, any, any, (import("mongoose").Document<unknown, any, MatchPayment, any, import("mongoose").DefaultSchemaOptions> & MatchPayment & {
    _id: Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (import("mongoose").Document<unknown, any, MatchPayment, any, import("mongoose").DefaultSchemaOptions> & MatchPayment & {
    _id: Types.ObjectId;
} & {
    __v: number;
}), any, MatchPayment>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, MatchPayment, import("mongoose").Document<unknown, {}, MatchPayment, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<MatchPayment & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    user?: import("mongoose").SchemaDefinitionProperty<User | Types.ObjectId, MatchPayment, import("mongoose").Document<unknown, {}, MatchPayment, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<MatchPayment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    match?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | Match, MatchPayment, import("mongoose").Document<unknown, {}, MatchPayment, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<MatchPayment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    amount?: import("mongoose").SchemaDefinitionProperty<number, MatchPayment, import("mongoose").Document<unknown, {}, MatchPayment, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<MatchPayment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isPaid?: import("mongoose").SchemaDefinitionProperty<boolean, MatchPayment, import("mongoose").Document<unknown, {}, MatchPayment, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<MatchPayment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    paidAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, MatchPayment, import("mongoose").Document<unknown, {}, MatchPayment, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<MatchPayment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    note?: import("mongoose").SchemaDefinitionProperty<string | undefined, MatchPayment, import("mongoose").Document<unknown, {}, MatchPayment, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<MatchPayment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, MatchPayment>;
