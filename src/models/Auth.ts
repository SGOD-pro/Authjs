import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface IUser extends Document {
	role: 0 | 1;
	email: string;
	password: string;
	avatar?: string;
    isPasswordCorrect(password: string): Promise<boolean>;
    generateAccessToken(): string;
    generateRefreshToken(): string;
    refreshToken?: string;
}

const UserSchema: Schema = new Schema(
	{
		email: { type: String, required: true, unique: [true,"This email is already registerd."] },
		password: { type: String, required: true },
		role: { type: Number, default: 0 },
		avatar: { type: String, default: null },
        refreshToken: { type: String, default: null },
	},
	{
		timestamps: true,
	}
);

UserSchema.pre("save", async function (next) {
	const user = this as unknown as IUser;
	if (!user.isModified("password")) return next();

	try {
		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(user.password, salt);
		next();
	} catch (err: any) {
		next(err);
	}
});

UserSchema.methods.generateRefreshToken = function () {
	const user = this as IUser;
	const payload = { _id: user._id };
	const token = jwt.sign(payload, process.env.JWT_REFRESH_KEY!, {
		expiresIn: "7d",
	});
    this.refreshToken = token;
	return token;
};

UserSchema.methods.generateAccessToken = function () {
	const user = this as IUser;
	const payload = { _id: user._id, role: user.role, email: user.email };
	const token = jwt.sign(payload, process.env.JWT_ACCESS_KEY!, {
		expiresIn: "1h",
	});
	return token;
};
UserSchema.methods.isPasswordCorrect = async function (password: string) {
    const user = this as IUser;
    return await bcrypt.compare(password, user.password);
};
const User = mongoose.model<IUser>("User", UserSchema);
export default User;
