import dotenv from "dotenv";
dotenv.config();
import express from "express";
const router = express.Router();
import { expressjwt as jwt } from "express-jwt";
const jwtSecret = process.env.SECRET_KEY;
console.log(">>> sec", jwtSecret);
import { ValidateUser } from "../../utils/validateUser.js";

// Importing All routes
import notFound from "./notFoundRoute.js";
import userRoute from "./userRoute.js";
import bookRoute from "./bookRoute.js";
// Validating token secret
router.use(
    jwt({ algorithms: ["HS256"], secret: jwtSecret }).unless({
        path: [
            // /^\/api\/v1\/user\/login/,
            "/api/v1/user/login",
        ],
    })
);

// User routes
router.use("/user", userRoute);
// Validating Below routes
router.use(ValidateUser.controller);
// All version v1 routes
router.use("/book", bookRoute);
// Page not found route
router.all("*", notFound);

export default router;
