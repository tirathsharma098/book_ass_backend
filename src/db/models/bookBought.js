import * as mongoose from "mongoose";
const { Schema, model } = mongoose;

const bookBoughtSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        book: {
            type: Schema.Types.ObjectId,
            ref: 'Book',
            required: true
        },
        approved: {
            type: Boolean,
            required: true,
            default: false
        }
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    }
);

const BookBought = model("BookBought", bookBoughtSchema);
export default BookBought;
