import { HydratedDocument, Types } from 'mongoose';
import { Match } from '../../matches/schemas/match.schema.js';
export declare enum ExpenseCategory {
    FIELD_RENTAL = "field_rental",
    DRINKS = "drinks",
    EQUIPMENT = "equipment",
    OTHER = "other"
}
export type ExpenseDocument = HydratedDocument<Expense> & {
    createdAt: Date;
    updatedAt: Date;
};
export declare class Expense {
    description: string;
    amount: number;
    category: ExpenseCategory;
    match?: Match | Types.ObjectId;
    date: Date;
    note?: string;
}
export declare const ExpenseSchema: import("mongoose").Schema<Expense, import("mongoose").Model<Expense, any, any, any, (import("mongoose").Document<unknown, any, Expense, any, import("mongoose").DefaultSchemaOptions> & Expense & {
    _id: Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (import("mongoose").Document<unknown, any, Expense, any, import("mongoose").DefaultSchemaOptions> & Expense & {
    _id: Types.ObjectId;
} & {
    __v: number;
}), any, Expense>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Expense, import("mongoose").Document<unknown, {}, Expense, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Expense & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    description?: import("mongoose").SchemaDefinitionProperty<string, Expense, import("mongoose").Document<unknown, {}, Expense, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Expense & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    amount?: import("mongoose").SchemaDefinitionProperty<number, Expense, import("mongoose").Document<unknown, {}, Expense, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Expense & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    category?: import("mongoose").SchemaDefinitionProperty<ExpenseCategory, Expense, import("mongoose").Document<unknown, {}, Expense, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Expense & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    match?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | Match | undefined, Expense, import("mongoose").Document<unknown, {}, Expense, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Expense & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    date?: import("mongoose").SchemaDefinitionProperty<Date, Expense, import("mongoose").Document<unknown, {}, Expense, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Expense & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    note?: import("mongoose").SchemaDefinitionProperty<string | undefined, Expense, import("mongoose").Document<unknown, {}, Expense, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Expense & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Expense>;
