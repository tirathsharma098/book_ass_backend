import express from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import { ValidateUser } from "../../utils/validateUser.js";
import { userLogin, addNewUser, userList } from "../controllers/user.js";
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
export default router;
