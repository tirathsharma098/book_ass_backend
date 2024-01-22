import mongoose from "mongoose";

export async function connectDB() {
    try {
        await mongoose.connect("mongodb://localhost:27017/sartia-global");
        console.log(">>> Connected to database Successfully.");
    } catch (err) {
        console.log(">>> Database Error occurred", err);
        throw new Error(`>>> DATABASE : ${err}`)
    }
}
