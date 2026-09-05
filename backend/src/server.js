import "dotenv/config";

import app from "./app.js";
import { connectDatabase } from "./config/database.js";
import { connectRedis } from "./config/redis.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDatabase();
  await connectRedis();

  app.listen(PORT, () => {
    console.log(
      `LinkScale server running on port ${PORT}`
    );
  });
};

startServer();