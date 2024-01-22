import * as mongoose from "mongoose";
import { USER_STATUS, USER_TYPE } from "../../utils/constants.js";
const { Schema, model } = mongoose;

const userSchema = new Schema(
    {
        full_name: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            unique: true,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            unique: true,
            required: true,
        },
        mobile: {
            type: String,
            unique: true,
        },
        user_type: {
            type: String,
            enum: [USER_TYPE.SUPER_ADMIN, USER_TYPE.ADMIN, USER_TYPE.CUSTOMER],
            default: USER_TYPE.CUSTOMER,
            required: true,
        },
        status: {
            type: String,
            enum: [USER_STATUS.ACTIVE, USER_STATUS.INACTIVE],
            default: USER_STATUS.ACTIVE,
            required: true,
        },
        // tokens: [{ type: Schema.Types.ObjectId, ref: "Token", default: [] }],
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    }
);

const User = model("User", userSchema);
export default User;
