import * as mongoose from "mongoose";
const { Schema, model } = mongoose;

const bookSchema = new Schema(
    {
        title: {
            type: String,
            unique: true,
            required: true,
        },
        author: {
            type: String,
        },
        summary: {
            type: String,
        },
        price: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    }
);

const Book = model("Book", bookSchema);
export default Book;
