import User from "../../db/models/user.js";
import {
    AUTH_LOG_TYPE,
    CONTROLLER,
    REGEX_EMAIL,
    REGEX_MOBILE,
    REGEX_USERNAME,
    USER_STATUS,
    USER_TYPE,
    VALIDATOR,
} from "../../utils/constants.js";
import { getGeolocationInfo } from "./get-geo-ip.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { getJWTToken } from "../../utils/jwt.helper.js";
import Token from "../../db/models/token.js";
import { addAuthLogs } from "./authLog.js";
import { celebrate, Joi } from "celebrate";
import bcrypt from "bcrypt";
import moment from "moment";
import httpStatus from "http-status";

const userLogin = {
    [VALIDATOR]: celebrate({
        body: Joi.object()
            .keys({
                username: Joi.string().min(4).max(100).required(),
                password: Joi.string().min(8).max(70).required(),
            })
            .required(),
    }),
    [CONTROLLER]: async (req, res) => {
        const { password, username } = req.body;
        const gotUser = await User.findOne({
            $or: [{ email: username }, { username }],
        });
        // If user not found save auth log and send false
        if (!gotUser) {
            req.auth_log_data = {
                type: AUTH_LOG_TYPE.INVALID_EMAIL,
                username,
                email: username,
                device_ip: req?.ip,
                success: false,
                message: "User entered wrong email or username",
                browser_info: `${getGeolocationInfo(req)}`,
            };
            await addAuthLogs.controller(req);
            return sendResponse(
                res,
                {},
                "Email, Username or Password is Incorrect",
                false,
                httpStatus.OK
            );
        }

        // if password not match return user
        const isMatch = await bcrypt.compare(password, gotUser.password);
        if (!isMatch) {
            req.auth_log_data = {
                authLogUser: gotUser,
                type: AUTH_LOG_TYPE.WRONG_PASSWORD,
                username,
                email: username,
                device_ip: req?.ip,
                success: false,
                message: "User entered wrong password",
                browser_info: `${getGeolocationInfo(req)}`,
            };
            await addAuthLogs.controller(req);
            return sendResponse(
                res,
                {},
                "Email, Username or Password is Incorrect",
                false,
                httpStatus.OK
            );
        }
        // check if user is not verified or inactive
        if (gotUser.status !== USER_STATUS.ACTIVE) {
            req.auth_log_data = {
                authLogUser: gotUser,
                type: AUTH_LOG_TYPE.LOGIN,
                username,
                email: username,
                device_ip: req?.ip,
                success: false,
                message:
                    "User is not active but entered correct password and email",
                browser_info: `${getGeolocationInfo(req)}`,
            };
            await addAuthLogs.controller(req);
            return sendResponse(
                res,
                {},
                "Your account is not active",
                false,
                httpStatus.OK
            );
        }
        // creating jwt token for user auth
        const tokenGot = getJWTToken({
            id: gotUser._id,
        });
        const expiryDate = moment(new Date(), "YYYY-MM-DD")
            .add(30, "days")
            .toString();
        // adding created token into token table to validate token
        const newTokenData = {
            user: gotUser,
            valid_till: expiryDate,
            token: tokenGot,
        };
        const tokenDataCreated = new Token(newTokenData);
        await tokenDataCreated.save();
        // Adding auth logs for successfully logged in
        req.auth_log_data = {
            authLogUser: gotUser,
            type: AUTH_LOG_TYPE.LOGIN,
            username,
            email: username,
            device_ip: req.ip,
            success: true,
            message: "User logged in successfully",
            browser_info: `${getGeolocationInfo(req)}`,
        };
        await addAuthLogs.controller(req);
        const userToSend = {
            id: gotUser.id,
            token: tokenGot,
            full_name: gotUser.full_name,
            user_type: gotUser.user_type,
        };
        return sendResponse(
            res,
            userToSend,
            "User LoggedIn successfully",
            true,
            httpStatus.OK
        );
    },
};

const signUpUser = {
    [VALIDATOR]: celebrate({
        body: Joi.object()
            .keys({
                full_name: Joi.string()
                    .required()
                    .label("Full Name")
                    .messages({ "*": "Please enter Full Name" }),
                username: Joi.string()
                    .regex(REGEX_USERNAME)
                    .required()
                    .messages({
                        "*": "Please enter Username of {full_name}",
                    }),
                password: Joi.string().min(8).max(70).required(),
                email: Joi.string()
                    .email()
                    .regex(REGEX_EMAIL)
                    .allow("")
                    .messages({
                        "*": "Please enter valid email of {full_name}",
                    }),
                mobile: Joi.string().length(10).pattern(REGEX_MOBILE),
            })
            .required(),
    }),
    [CONTROLLER]: async (req, res) => {
        const { full_name, username, email, mobile, password } = req.body;
        const gotUser = await User.findOne({
            $or: [{ email }, { username }, { mobile }],
        });
        if (gotUser)
            return sendResponse(
                res,
                {},
                "User already exist",
                false,
                httpStatus.OK
            );
        const encryptedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({
            full_name,
            username,
            email,
            mobile,
            password: encryptedPassword,
        });
        await newUser.save();
        return sendResponse(
            res,
            { signed: true },
            "User signup successfully",
            true,
            httpStatus.OK
        );
    },
};

const addNewUser = {
    [VALIDATOR]: celebrate({
        body: Joi.object()
            .keys({
                full_name: Joi.string()
                    .required()
                    .label("Full Name")
                    .messages({ "*": "Please enter Full Name" }),
                username: Joi.string()
                    .regex(REGEX_USERNAME)
                    .required()
                    .messages({
                        "*": "Please enter Username of {full_name}",
                    }),
                password: Joi.string().min(8).max(70).required(),
                email: Joi.string()
                    .email()
                    .regex(REGEX_EMAIL)
                    .allow("")
                    .messages({
                        "*": "Please enter valid email of {full_name}",
                    }),
                mobile: Joi.string().length(10).pattern(REGEX_MOBILE),
                user_type: Joi.string()
                    .valid(USER_TYPE.ADMIN, USER_TYPE.CUSTOMER)
                    .required()
                    .messages({
                        "*": "Please tell User Type of {full_name}",
                    }),
            })
            .required(),
    }),
    [CONTROLLER]: async (req, res) => {
        const { full_name, username, email, user_type, mobile, password } =
            req.body;
        const gotUser = await User.findOne({
            $or: [{ email }, { username }, { mobile }],
        });
        if (gotUser)
            return sendResponse(
                res,
                {},
                "User already exist",
                false,
                httpStatus.OK
            );
        const encryptedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({
            full_name,
            username,
            email,
            user_type,
            mobile,
            password: encryptedPassword,
        });
        await newUser.save();
        return sendResponse(
            res,
            {},
            "User added successfully",
            true,
            httpStatus.OK
        );
    },
};

const userList = {
    [VALIDATOR]: celebrate({
        query: Joi.object()
            .keys({
                search_term: Joi.string().allow("", null),
                sort_field: Joi.string().trim().allow(null, ""),
                sort_order: Joi.string().valid("ASC", "DESC").allow(""),
                per_page: Joi.number().integer().min(1).required(),
                page_number: Joi.number().integer().min(1).required(),
            })
            .required(),
    }),
    [CONTROLLER]: async (req, res) => {
        const { search_term, per_page, sort_field, sort_order, page_number } =
            req.query;
        let aggr = [
            {
                $match: {
                    _id: { $nin: [req.currentUser._id] },
                },
            },
            { $sort: { order_number: -1 } },
            {
                $skip: Number(per_page) * (Number(page_number) - 1),
            },
            { $limit: per_page },
        ];
        if (search_term)
            aggr[0]["$match"]["$or"] = [
                { full_name: search_term },
                { email: search_term },
                { mobile: search_term },
                { username: search_term },
            ];
        const aggregate = User.aggregate(aggr);

        const foundData = await aggregate.exec();
        // console.log(">>> DATA GOT : ", foundData);
        return sendResponse(
            res,
            foundData,
            "User list got successfully",
            true,
            httpStatus.OK
        );
    },
};

const getUserDetail = {
    [VALIDATOR]: celebrate({
        params: Joi.object()
            .keys({
                id: Joi.string()
                    .regex(/^[0-9a-fA-F]{24}$/)
                    .required(),
            })
            .required(),
    }),
    [CONTROLLER]: async (req, res) => {
        const { id } = req.params;
        const userGot = await User.findById(id);
        return sendResponse(
            res,
            userGot,
            "User got successfully",
            true,
            httpStatus.OK
        );
    },
};

const updateUserById = {
    [VALIDATOR]: celebrate({
        params: Joi.object()
            .keys({
                id: Joi.string()
                    .regex(/^[0-9a-fA-F]{24}$/)
                    .required(),
            })
            .required(),
        body: Joi.object()
            .keys({
                full_name: Joi.string()
                    .required()
                    .label("Full Name")
                    .messages({ "*": "Please enter Full Name" }),
                username: Joi.string()
                    .regex(REGEX_USERNAME)
                    .required()
                    .messages({
                        "*": "Please enter Username of {full_name}",
                    }),
                password: Joi.string().min(8).max(70).required(),
                email: Joi.string()
                    .email()
                    .regex(REGEX_EMAIL)
                    .allow("")
                    .messages({
                        "*": "Please enter valid email of {full_name}",
                    }),
                mobile: Joi.string().length(10).pattern(REGEX_MOBILE),
                user_type: Joi.string()
                    .valid(USER_TYPE.ADMIN, USER_TYPE.CUSTOMER)
                    .required()
                    .messages({
                        "*": "Please tell User Type of {full_name}",
                    }),
            })
            .required(),
    }),
    [CONTROLLER]: async (req, res) => {
        const { id } = req.params;
        const userGot = await User.findById(id);
        if (!userGot)
            return sendResponse(res, {}, "User not found", true, httpStatus.OK);
        const encryptedPassword = await bcrypt.hash(req.body.password, 12);
        await User.findByIdAndUpdate(id, {
            ...req.body,
            password: encryptedPassword,
        });
        return sendResponse(
            res,
            userGot,
            "User updated successfully",
            true,
            httpStatus.OK
        );
    },
};

const getMyProfile = {
    [CONTROLLER]: async (req, res) => {
        const userGot = await User.findById(req.currentUser._id);
        if (!userGot)
            return sendResponse(res, {}, "User not found", true, httpStatus.OK);
        return sendResponse(
            res,
            userGot,
            "User got successfully",
            true,
            httpStatus.OK
        );
    },
};
const userLoggedOut = {
    [CONTROLLER]: async (req, res) => {
        await Token.findOneAndDelete({ token: req.headers.authorization });
        return sendResponse(
            res,
            {},
            "User logged out successfully",
            true,
            httpStatus.OK
        );
    },
};

const updateUserStatus = {
    [VALIDATOR]: celebrate({
        params: Joi.object()
            .keys({
                id: Joi.string()
                    .regex(/^[0-9a-fA-F]{24}$/)
                    .required(),
            })
            .required(),
        body: Joi.object()
            .keys({
                status: Joi.string()
                    .valid(USER_STATUS.ACTIVE, USER_STATUS.INACTIVE)
                    .required()
                    .messages({
                        "*": "Please tell User status",
                    }),
            })
            .required(),
    }),
    [CONTROLLER]: async (req, res) => {
        await User.findByIdAndUpdate(req.params.id, {
            status: req.body.status,
        });
        return sendResponse(
            res,
            {},
            "User status updated successfully",
            true,
            httpStatus.OK
        );
    },
};
export {
    userLogin,
    addNewUser,
    userList,
    getUserDetail,
    updateUserById,
    signUpUser,
    getMyProfile,
    userLoggedOut,
    updateUserStatus,
};
