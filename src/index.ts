import  {app}  from "./app.js";
import ConnectDB from "./db/index.js";
import dotenv from 'dotenv'
dotenv.config({ path: './.env' })


const PORT = 8080;
ConnectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error) => {
    console.error(`Errors: ${(error as Error).message}`);
    process.exit(1);
});