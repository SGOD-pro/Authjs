import { app } from "./app.js";
import ConnectDB from "./db/index.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: "./.env" });

// Connect to the database
(async () => {
  try {
    await ConnectDB();
    console.log("Database connected successfully!");
  } catch (error) {
    console.error(`Database connection error: ${(error as Error).message}`);
    process.exit(1); // Exit if the database connection fails
  }
})();

// Export the app (this is optional in case you want to reuse it elsewhere)
export { app };
