import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: true,
        },
        chosenNiche: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },
        techStack: {
            type: [String],
            required: true,
            validate: [
                (val) => val.length > 0,
                "User must select at least one technology"
            ]
        },
        progress: {
            niche: { type: Number, default: 1 },
            behavioral: { type: Number, default: 1 },
            combo: { type: Number, default: 1 },
        },
    },
    { timestamps: true }
);

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);