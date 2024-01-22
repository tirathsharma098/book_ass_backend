const USER_TYPE = {
    SUPER_ADMIN: "super_admin",
    ADMIN: "admin",
    CUSTOMER: "customer",
};
const USER_STATUS = {
    ACTIVE: "active",
    INACTIVE: "inactive",
};
const VALIDATOR = "validator";
const CONTROLLER = "controller";
const REGEX_EMAIL =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const REGEX_MOBILE = /^(\+\d{1,3}[- ]?)?\d{10}$/;
const REGEX_USERNAME = /^[a-zA-Z0-9._-]{2,40}$/;
const REGEX_PASSWORD =
    /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/;

const AUTH_LOG_TYPE = {
    LOGIN: "Login",
    LOGOUT: "Logout",
    PASSWORD_CHANGE: "Password Change",
    PASSWORD_RESET: "Password Reset",
    WRONG_PASSWORD: "Wrong Password",
    INVALID_EMAIL: "Invalid Email",
    IP_NOT_FOUND: "IP not found",
};

export {
    USER_TYPE,
    USER_STATUS,
    VALIDATOR,
    CONTROLLER,
    AUTH_LOG_TYPE,
    REGEX_EMAIL,
    REGEX_MOBILE,
    REGEX_PASSWORD,
    REGEX_USERNAME,
};
