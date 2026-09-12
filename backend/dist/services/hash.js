import bcrypt from "bcryptjs";
import config from "../config/index.js";
const { saltRounds } = config;
const hashPassword = async (password) => {
    try {
        const s = await bcrypt.genSalt(saltRounds);
        const passwordHash = await bcrypt.hash(password, s);
        return passwordHash;
    }
    catch (err) {
        throw new Error(`Error hashing the password: ${err.message}`);
    }
};
const compareHash = async (currPassword, hashwedPassword) => {
    try {
        const isMatch = await bcrypt.compare(currPassword, hashwedPassword);
        return isMatch;
    }
    catch (err) {
        console.error(`Bcrypt comparison error: ${err.message}`);
        return false;
    }
};
const hashService = {
    hashingPassword: hashPassword,
    compareHashedPassword: compareHash,
};
export default hashService;
//# sourceMappingURL=hash.js.map