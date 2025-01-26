import serverless from "serverless-http";
import { app } from "../../src/app.js";
import ConnectDB from "../../src/db/index.js";

const handler = async (event:any, context:any) => {
  await ConnectDB();
  const serverlessHandler = serverless(app);
  return serverlessHandler(event, context);
};
export { handler };