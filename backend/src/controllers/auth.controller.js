const User = require("../models/user");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");


const generateToken = (user) => {
    const payload = {
        id: user._id
    }
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
}

exports.googleLogin = async (req, res) => {
    try {

        const {credential} = req.body;

        if(!credential){
            return res.status(400).json({"message": "Google credential is required."})
        }

        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        })
        const payload = ticket.getPayload();

        const googleUser = {
            googleId: payload.sub,
            name: payload.name,
            email: payload.email,
            avatar: payload.picture
        }
        const existingUser = await User.findOne({ googleId: googleUser.googleId });
        
            let user = await User.findOne({ googleId: googleUser.googleId });
            if(!user){
                user = new User(googleUser);
                await user.save();
            }

        const token = generateToken(user);
        return res.status(200).json({ message: "Login successful", token, user });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Server error"
        });
    }
};