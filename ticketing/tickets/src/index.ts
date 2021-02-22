import mongoose from 'mongoose';

import { app } from './app';
import { natsWrapper } from './nats.wrapper';

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }

  // * Connect to NATS
  const clusterId = 'ticketing'; // got from nats-depl.yaml
  const natsUrl = 'http://nats-srv:4222'; // based on nats-depl.yaml settings

  await natsWrapper.connect(clusterId, 'client-id-random', natsUrl);

  natsWrapper.client.on('close', () => {
    console.log('NATS connection closed!');
    process.exit();
  });
  process.on('SIGINT', () => natsWrapper.client.close());
  process.on('SIGTERM', () => natsWrapper.client.close());

  // * Connect to MONGO DB
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    console.log('Connected to MongoDB!');
  } catch (error) {
    console.log('Connect to db error', error);
  }

  app.listen(3000, () => {
    console.log('Auth service listening on port 3000!');
  });
};

start();
