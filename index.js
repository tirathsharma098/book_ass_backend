import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import { errorHandler } from "./src/utils/errorHandler.js";
import { settingHeader } from "./src/utils/setHeader.js";
import { connectDB } from "./src/db/index.js";
import apiRoutes from "./src/api/routes/index.js";

const app = express();
// Setting cors
app.use(cors());
app.all("*", settingHeader);
app.use(helmet());
app.use(express.json());

app.set("trust proxy", true);

console.log(">>> sec in : ", process.env.SECRET_KEY)

connectDB().catch(err => console.log(">>> DB ERROR : ", err));
app.use(mongoSanitize());

// All Routes
app.get("/", (req, res) => {
    res.json({
        message: "🏡 Hello 🏡",
    });
});
app.use("/api/v1", apiRoutes);
// Error Handler
app.use(errorHandler);


app.listen(process.env.PORT, () => {
    console.log(`>>> Started listening at localhost:${process.env.PORT}`);
});
