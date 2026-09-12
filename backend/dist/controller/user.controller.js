import userModel from "../db/mongodb/user/user.model.js";
import hashService from "../services/hash.js";
import jwtService from "../services/jwt.js";
const avatarMap = {
    male: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSENR1KLZzIFB6aG-0CUvDNjvNCDc9Vnhj4JUJau2kJRg&s=10",
    female: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdocfNblhrKpFvdWYm15zCN_Uuk3mATJ1Fmm-pAgv8sQ&s=10",
    other: "https://media.istockphoto.com/id/2151669184/vector/vector-flat-illustration-in-grayscale-avatar-user-profile-person-icon-gender-neutral.jpg?s=612x612&w=0&k=20&c=UEa7oHoOL30ynvmJzSCIPrwwopJdfqzBs0q69ezQoM8=",
};
const getAvatar = (gender) => avatarMap[gender];
// login controller 
export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email }).select("+password");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not registered!, Please first register ",
            });
        }
        const isPasswordMatch = await hashService.compareHashedPassword(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: "Incorrect Password !",
            });
        }
        ;
        const accessToken = jwtService.createAccessToken(user._id.toString());
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });
        const { password: _, ...userResponse } = user.toObject();
        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                user: userResponse,
            },
        });
    }
    catch (err) {
        console.error(`Login user error: ${err.message}`);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while logging in",
        });
    }
};
//# sourceMappingURL=user.controller.js.map