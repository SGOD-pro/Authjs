import serverless from "serverless-http";
import { app } from "../../src/app";
import ConnectDB from "../../src/db";

const handler = async (event, context) => {

  await ConnectDB();

  const serverlessHandler = serverless(app);
  return serverlessHandler(event, context);
};

export { handler };
