import { sendResponse } from "./sendResponse.js";
import { isCelebrateError } from "celebrate";
import httpStatus from "http-status";

export const errorHandler = (
    err,
    req,
    res,
    next
) => {
    const isValidationError = isCelebrateError(err);
    const { status = 500 } = err;
    if (isValidationError) {
        const errorBody = err.details.get("body")
            ? err.details.get("body")
            : err.details.get("params")
            ? err.details.get("params")
            : err.details.get("query");
        const {
            details: [errorDetails],
        } = errorBody;
        const message = errorDetails.message;
        return sendResponse(res, {}, message, false, httpStatus.OK);
    }
    if (err.name === "UnauthorizedError")
        return sendResponse(
            res,
            {},
            "Please login first",
            false,
            httpStatus.UNAUTHORIZED
        );
    const message = "O Ooo! Something Went Wrong!";
    // if (err.message) message = err.message;
    console.log(">> ERROR OCCURRED IN ERROR HANDLER: ", err);
    return sendResponse(res, {}, message, false, status);
};
