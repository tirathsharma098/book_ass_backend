
export const settingHeader = (
    req,
    res,
    next
) => {
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With, content-type, Authorization, Accept"
    );
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Expose-Headers", "Authorization");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
    next();
};
