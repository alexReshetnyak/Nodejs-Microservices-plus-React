import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

declare global {
  namespace NodeJS {
    interface Global {
      signin(): string[];
    }
  }
}

jest.mock('../nats.wrapper.ts');

let mongo: MongoMemoryServer;

beforeAll(async () => {
  process.env.JWT_KEY = 'asdf';

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  mongoose.connection.close();
});

global.signin = () => {
  // * build JWT payload. { id, email }
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'test_email@test.com',
  };

  // * Create the JWT!
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // * Build session Object. { jwt: MY_JWT }
  const session = { jwt: token };

  // * Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // * Take JSON and encode it to base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // * Return a string thats a cookie with encoded data
  return [`express:sess=${base64}`];
};
