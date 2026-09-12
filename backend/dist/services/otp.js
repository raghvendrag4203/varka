import crypto from 'crypto';
const generateOTP = () => {
    const otp = crypto.randomInt(0, 1000000).toString().padStart(6, '0');
    return otp;
};
export default generateOTP;
//# sourceMappingURL=otp.js.map