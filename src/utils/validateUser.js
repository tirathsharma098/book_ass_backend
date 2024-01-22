import httpStatus from "http-status";
import { decodeToken } from "./jwt.helper.js";
import { sendResponse } from "./sendResponse.js";
import { USER_STATUS } from "./constants.js";
import Token from "../db/models/token.js";

export const ValidateUser = {
    controller: async (req, res, next) => {
        try {
            const userTokenGot = req.headers.authorization;
            const payloadOfToken = decodeToken(userTokenGot);
            if (!payloadOfToken?.id)
                return sendResponse(
                    res,
                    {},
                    "Token is not valid",
                    false,
                    httpStatus.UNAUTHORIZED
                );
            const gotTokenData = await Token.findOne({
                token: userTokenGot,
            }).populate({ path: "user" });
            // console.log(">>> while val : ", gotTokenData)
            if (
                !gotTokenData ||
                !payloadOfToken?.id ||
                payloadOfToken.id != gotTokenData.user._id
            ) {
                return sendResponse(
                    res,
                    {},
                    "User Validation Failed, Please login again",
                    false,
                    httpStatus.UNAUTHORIZED
                );
            }
            const todayDate = new Date().getTime();
            const valid_till = new Date(gotTokenData?.valid_till).getTime();
            if (!gotTokenData || todayDate > valid_till) {
                if (todayDate > valid_till)
                    await Token.deleteOne({ token: userTokenGot });
                return sendResponse(
                    res,
                    {},
                    "Your Token has been expired, Please login again.",
                    false,
                    httpStatus.UNAUTHORIZED
                );
            }
            const message =
                gotTokenData.user.status === USER_STATUS.INACTIVE
                    ? "Your account is closed, Ask admin to Login again"
                    : undefined;
            if (message)
                return sendResponse(
                    res,
                    {},
                    message,
                    false,
                    httpStatus.BAD_REQUEST
                );
            req.currentUser = gotTokenData.user;
            return next();
        } catch (err) {
            console.log(">> ERROR OCCURRED WHILE VALIDATING USER IN: ", err);
            return sendResponse(
                res,
                {},
                "Something unexpected happened While Validating User",
                false,
                httpStatus.BAD_REQUEST
            );
        }
    },
};
