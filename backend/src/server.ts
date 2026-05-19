import 'dotenv/config';
import mongoose from 'mongoose';
import { createApp } from './app';
import { logger } from './utils/logger';

const port = Number(process.env.PORT ?? 3000);

async function start() {
  const mongoUri =
    process.env.MONGODB_URI ?? 'mongodb://localhost:27017/candidate_manager';

  await mongoose.connect(mongoUri);
  logger.info('Connected to MongoDB', { uri: mongoUri.replace(/\/\/.*@/, '//***@') });

  const app = createApp();
  app.listen(port, () => {
    logger.info('Server started', { port });
  });
}

start().catch((error) => {
  logger.error('Failed to start server', { error: error.message });
  process.exit(1);
});
