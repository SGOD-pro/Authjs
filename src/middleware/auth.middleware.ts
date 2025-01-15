import  User  from "../models/Auth.js";
import  apiErrors  from "../helper/ApiError.js";
import asyncHandeler from "../helper/AsyncHandeler.js";
import jwt,{JwtPayload} from "jsonwebtoken";
import { Request, NextFunction } from "express";

declare module "express-serve-static-core" {
    interface Request {
        user?: any;
    }
}

export const isVerifiedJWT = asyncHandeler(async (req:Request, _, next:NextFunction) => {
    try {
        const token = req.cookies?.accessToken || req.header('Authorization')?.replace("Bearer", "")
        if (!token) {
            throw new apiErrors(401, "Unautorized request")
        }
        const decodedToken = jwt.verify(token, process.env.JWT_ACCESS_KEY as string) as JwtPayload;
        const user = await User.findById(decodedToken?._id).select('-password -refreshToken');

        if (!user) {
            throw new apiErrors(401, "Invalid access token")
        }
        req.user = user
        next()
    } catch (error:any) {
        throw new apiErrors(401, error.message || "Invalid access token")
    }
})