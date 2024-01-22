import AuthLog from "../../db/models/authLog.js";
import { CONTROLLER } from "../../utils/constants.js";

export const addAuthLogs = {
    [CONTROLLER]: async (req) => {
        const newAuthLog = {
            ...JSON.parse(JSON.stringify(req.auth_log_data)),
        };
        const authLogCreated = new AuthLog(newAuthLog);
        await authLogCreated.save(authLogCreated);
    },
};