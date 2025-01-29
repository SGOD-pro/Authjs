import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import userRouter from "./routes/auth.routes.js";
import ConnectDB from "./db/index.js";

dotenv.config({ path: "./.env" });

const app = express();
app.use(
	cors({
		origin: process.env.CORS_ORIGIN,
		credentials: true,
	})
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/user", userRouter); // User routes
app.get("/api", (_, res) => {
	res.send("Hello World");
});
ConnectDB()
	.then(() => {
		app.listen(process.env.PORT || 8080, () => {
			console.log("Server is running!");
		});
	})
	.catch((error) => {
		console.error("Database connection failed:", error);
	});
export { app };
