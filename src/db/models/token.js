import * as mongoose from "mongoose";
const { Schema, model } = mongoose;

const tokenSchema = new Schema(
    {
        token: {
            type: String,
            unique: true,
            required: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        valid_till: {
            type: String,
        }
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    }
);

const Token = model("Token", tokenSchema);
export default Token;
