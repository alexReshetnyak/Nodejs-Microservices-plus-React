import { randomBytes } from 'crypto';
import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();

app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
  res.send(posts);
});

app.post('/posts/create', async (req, res) => {
  const id = randomBytes(4).toString('hex');
  const { title } = req.body;

  posts[id] = { id, title };

  // kubectl get services - to find out correct service name
  await axios.post('http://event-bus-srv:4005/events', {
    type: 'PostCreated',
    data: {
      id,
      title
    }
  });

  res.status(201).send(posts[id]);
});

app.post('/events', (req, res) => {
  console.log('Received event:', req.body);

  res.send({});
});

app.listen(4000, () => {
  console.log('v3');
  console.log('Posts service listening on port: 4000');
});
