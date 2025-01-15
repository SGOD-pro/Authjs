import { Router } from "express";
import { logout, register, login,regenerateToken } from "../controllers/user.controller.js";
// import { upload } from "../middlewares/multer.js";
import { isVerifiedJWT } from "../middleware/auth.middleware.js";
const router = Router()
// router.route('/register').post(
//     upload.fields([
//         { name: 'avatar', maxCount: 1 },
//         { name: 'coverImage', maxCount: 1 }
//     ]), registerUser)
router.route('/register').post( register)
router.route('/login').post(login)
router.route('/logout').post(isVerifiedJWT, logout)
router.route('/refresh-token').post(regenerateToken)
export default router;