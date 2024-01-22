import express from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import { ValidateUser } from "../../utils/validateUser.js";
import {
    userLogin,
    addNewUser,
    userList,
    getUserDetail,
    updateUserById,
} from "../controllers/user.js";
import { validateSuperAdmin } from "../controllers/validators.js";
const router = express.Router();

router.post("/login", userLogin.validator, catchAsync(userLogin.controller));

// Validating below routes
router.use(ValidateUser.controller);

router.post(
    "/add-user",
    addNewUser.validator,
    validateSuperAdmin,
    catchAsync(addNewUser.controller)
);
router.get(
    "/users-list",
    userList.validator,
    validateSuperAdmin,
    catchAsync(userList.controller)
);
router.get(
    "/user-detail/:id",
    getUserDetail.validator,
    catchAsync(getUserDetail.controller)
);
router.put(
    "/update-user/:id",
    updateUserById.validator,
    catchAsync(updateUserById.controller)
);
export default router;
