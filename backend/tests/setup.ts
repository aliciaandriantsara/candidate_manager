import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-for-integration-tests!!';
process.env.JWT_EXPIRES_IN = '1h';
process.env.AUTH_EMAIL = 'admin@example.com';
process.env.AUTH_PASSWORD = 'Admin123!';
process.env.VALIDATION_DELAY_MS = '50';
process.env.RATE_LIMIT_MAX = '10000';
process.env.LOGIN_RATE_LIMIT_MAX = '5';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongoServer.getUri();
  await mongoose.connect(process.env.MONGODB_URI);
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key of Object.keys(collections)) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});
