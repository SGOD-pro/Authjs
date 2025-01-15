import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import Auth from "../models/Auth.js";
import ApiResponse from "../helper/Apiresponse.js";
import ApiError from "../helper/ApiError.js";
import asyncHandler from "../helper/AsyncHandeler.js";

const options = {
	httpOnly: true,
	secure: true,
};

export const register = asyncHandler(async (req: Request, res: Response) => {
	const { email, password } = req.body;
	const newUser = new Auth({ email, password });
	const accToken = newUser.generateAccessToken();
	const refToken = newUser.generateRefreshToken();
	const user = await newUser.save();
	return res
		.cookie("accessToken", accToken, options)
		.cookie("refreshToken", refToken, options)
		.status(201)
		.json(
			new ApiResponse(
				200,
				{ email: user.email, role: user.role, avatar: user.avatar },
				"User registered successfully"
			)
		);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
	const { email, password } = req.body;
	const user = await Auth.findOne({ email });
	if (!user || !(await user.isPasswordCorrect(password))) {
		throw new ApiError(400, "Invalid email or password");
	}
	const accToken = user.generateAccessToken();
	const refToken = user.generateRefreshToken();
	await user.save();
	return res
		.cookie("accessToken", accToken, options)
		.cookie("refreshToken", refToken, options)
		.status(200)
		.json(
			new ApiResponse(
				200,
				{ email: user.email, role: user.role, avatar: user.avatar },
				"Login successful"
			)
		);
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
	console.log("logout");
	await Auth.findByIdAndUpdate(
		req.user?._id,
		{ refreshToken: null },
		{ new: true }
	);
	return res
		.clearCookie("accessToken", options)
		.clearCookie("refreshToken", options)
		.status(200)
		.json({ message: "Logged out successfully" });
});

export const regenerateToken = asyncHandler(
	async (req: Request, res: Response) => {
		const token = req.cookies?.refreshToken;
		if (!token) {
			throw new ApiError(401, "Unautorized request");
		}
		const decodedToken = jwt.verify(
			token,
			process.env.JWT_REFRESH_KEY as string
		) as JwtPayload;
		const user = await Auth.findById(decodedToken?._id).select("-password");
		if (!user) {
			throw new ApiError(401, "Invalid refresh token");
		}
		if (user.refreshToken !== token) {
			throw new ApiError(401, "Invalid refresh token");
		}
		const accToken = user.generateAccessToken();
		const refToken = user.generateRefreshToken();
		res
			.cookie("accessToken", accToken, options)
			.cookie("refreshToken", refToken, options)
			.status(200)
			.json(
				new ApiResponse(
					200,
					{ email: user.email, role: user.role, avatar: user.avatar },
					"Token regenerated successfully"
				)
			);
	}
);
