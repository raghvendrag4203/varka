import jwt from "jsonwebtoken";
import config from "../config/index.js";
const { accessTokenSecret, accessTokenExpiry } = config;
const createAccessToken = (userId) => {
    try {
        return jwt.sign({ sub: userId }, accessTokenSecret, { expiresIn: accessTokenExpiry });
    }
    catch (err) {
        throw new Error(`Error creating access token: ${err.message}`);
    }
};
const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, accessTokenSecret);
    }
    catch (err) {
        console.error(`JWT verification failed: ${err instanceof Error
            ? err.message
            : "Unknown error"}`);
        return null;
    }
};
const jwtService = {
    createAccessToken,
    verifyAccessToken,
};
export default jwtService;
//# sourceMappingURL=jwt.js.map