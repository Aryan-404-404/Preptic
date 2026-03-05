import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const ALLOWED_NICHES = [
    "frontend",
    "backend",
    "fullstack",
    "datascience",
    "devops"
];

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
};

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error("All fields required");
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }

    const user = await User.create({
        name,
        email,
        password
    });

    res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        chosenNiche: user.chosenNiche || null,
        techStack: user.techStack || [],
        progress: user.progress,
        token: generateToken(user._id),
    });
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            chosenNiche: user.chosenNiche,
            techStack: user.techStack,
            progress: user.progress,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error("Invalid email or password");
    }
});

const getUserProfile = asyncHandler(async (req, res) => {
    res.json(req.user);
});

const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    if (req.body.name) {
        user.name = req.body.name;
    }

    if (req.body.password) {
        user.password = req.body.password; // pre-save middleware will hash
    }

    if (req.body.chosenNiche) {
        const formattedNiche = req.body.chosenNiche.toLowerCase().trim();

        if (!ALLOWED_NICHES.includes(formattedNiche)) {
            res.status(400);
            throw new Error("Invalid niche selected");
        }

        user.chosenNiche = formattedNiche;
        user.progress = { niche: 1, behavioral: 1, combo: 1 };
    }

    if (req.body.techStack) {
        if (!Array.isArray(req.body.techStack) || req.body.techStack.length === 0) {
            res.status(400);
            throw new Error("Select at least one technology");
        }

        user.techStack = req.body.techStack;
        user.progress = { niche: 1, behavioral: 1, combo: 1 };
    }

    const updatedUser = await user.save();

    res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        chosenNiche: updatedUser.chosenNiche,
        techStack: updatedUser.techStack,
        progress: updatedUser.progress,
    });
});

export { registerUser, loginUser, getUserProfile, updateUserProfile };