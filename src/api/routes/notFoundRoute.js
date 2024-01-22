import express from "express";
import { sendResponse } from "../../utils/sendResponse.js";
const router = express.Router();

router.all("*", (req, res) => {
    sendResponse(res, {}, "Requested page not found", false, 404);
});

export default router;
