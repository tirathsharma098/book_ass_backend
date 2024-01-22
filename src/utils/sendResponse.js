
export const sendResponse = (
    res,
    data={},
    message = "",
    success = false,
    status = 400
) => {
    return res.status(status).json({ data, message, success });
};
