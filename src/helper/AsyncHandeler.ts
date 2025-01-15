import { Request, Response, NextFunction } from 'express';
import ApiError from '../helper/ApiError.js';


const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        fn(req, res, next).catch((error: ApiError) => {
            // Handle the error and send the response here
            res.status(error.status || 500).json({ message: error.message || 'Internal Server Error' });
        });
    };
};


export default asyncHandler;