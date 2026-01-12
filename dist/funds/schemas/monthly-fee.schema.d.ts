import { HydratedDocument, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema.js';
export type MonthlyFeeDocument = HydratedDocument<MonthlyFee> & {
    createdAt: Date;
    updatedAt: Date;
};
export declare class MonthlyFee {
    user: User | Types.ObjectId;
    month: number;
    year: number;
    amount: number;
    isPaid: boolean;
    paidAt?: Date;
    note?: string;
}
export declare const MonthlyFeeSchema: import("mongoose").Schema<MonthlyFee, import("mongoose").Model<MonthlyFee, any, any, any, (import("mongoose").Document<unknown, any, MonthlyFee, any, import("mongoose").DefaultSchemaOptions> & MonthlyFee & {
    _id: Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (import("mongoose").Document<unknown, any, MonthlyFee, any, import("mongoose").DefaultSchemaOptions> & MonthlyFee & {
    _id: Types.ObjectId;
} & {
    __v: number;
}), any, MonthlyFee>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, MonthlyFee, import("mongoose").Document<unknown, {}, MonthlyFee, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<MonthlyFee & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    user?: import("mongoose").SchemaDefinitionProperty<User | Types.ObjectId, MonthlyFee, import("mongoose").Document<unknown, {}, MonthlyFee, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<MonthlyFee & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    month?: import("mongoose").SchemaDefinitionProperty<number, MonthlyFee, import("mongoose").Document<unknown, {}, MonthlyFee, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<MonthlyFee & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    year?: import("mongoose").SchemaDefinitionProperty<number, MonthlyFee, import("mongoose").Document<unknown, {}, MonthlyFee, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<MonthlyFee & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    amount?: import("mongoose").SchemaDefinitionProperty<number, MonthlyFee, import("mongoose").Document<unknown, {}, MonthlyFee, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<MonthlyFee & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isPaid?: import("mongoose").SchemaDefinitionProperty<boolean, MonthlyFee, import("mongoose").Document<unknown, {}, MonthlyFee, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<MonthlyFee & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    paidAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, MonthlyFee, import("mongoose").Document<unknown, {}, MonthlyFee, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<MonthlyFee & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    note?: import("mongoose").SchemaDefinitionProperty<string | undefined, MonthlyFee, import("mongoose").Document<unknown, {}, MonthlyFee, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<MonthlyFee & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, MonthlyFee>;
