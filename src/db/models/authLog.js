import * as mongoose from "mongoose";
const { Schema, model } = mongoose;

const authLogSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        email: {
            type: String,
            default: null,
        },
        username: {
            type: String,
            default: null,
        },
        success: {
            type: Boolean,
            default: null,
        },
        type: {
            type: String,
            default: null,
        },
        message: {
            type: String,
            default: null,
        },
        device_ip: {
            type: String,
            default: null,
        },
        browser_info: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    }
);

const AuthLog = model("AuthLog", authLogSchema);
export default AuthLog;
