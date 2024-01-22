import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
const jwtSecret = process.env.SECRET_KEY;

function decodeToken(token) {
    return jwt.decode(token.replace("Bearer ", ""));
}

function getJWTToken(data) {
    const token = `Bearer ${jwt.sign(data, jwtSecret)}`;
    return token;
}

export { decodeToken, getJWTToken };
