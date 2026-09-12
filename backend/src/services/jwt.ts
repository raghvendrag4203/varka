import jwt, { type SignOptions } from "jsonwebtoken";
import config from "../config/index.js";

const { accessTokenSecret, accessTokenExpiry } = config;

type TokenPayload = {
    sub: string;
};

const createAccessToken = (userId: string):string => {
    try {
        return jwt.sign(
            { sub: userId }, 
            accessTokenSecret, 
            { expiresIn: accessTokenExpiry as NonNullable<SignOptions['expiresIn']> }
        )
    } catch (err) {
        throw new Error(`Error creating access token: ${(err as Error).message}`);
    }
}

const verifyAccessToken = (
    token: string
): TokenPayload | null => {
    try {
        return jwt.verify(
            token,
            accessTokenSecret
        ) as TokenPayload;
    } catch (err) {
        console.error(
            `JWT verification failed: ${
                err instanceof Error
                    ? err.message
                    : "Unknown error"
            }`
        );

        return null;
    }
};

const jwtService = {
    createAccessToken,
    verifyAccessToken,
} as const 

export default jwtService