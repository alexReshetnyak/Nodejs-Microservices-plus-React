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

app.post('/posts', async (req, res) => {
  const id = randomBytes(4).toString('hex');
  const { title } = req.body;

  posts[id] = { id, title };

  await axios.post('http://localhost:4005/events', {
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
  console.log('Posts service listening on port: 4000');
});


// * DOCKER installation steps:

// * docker images -a   //list all images
// * docker images prune -a //  Remove all dangling images. If -a is specified, 
                            //* will also remove all images not referenced by any container

// * docker ps -a           // list all containers
// * docker rm container_id

// * docker build .   // create image, result: id - 54788ec314ca
// ? or docker build -t alexreshetnyak/posts .  // result: use docker id to create tagged image

// * docker run alexreshetnyak/posts  // create and run container
// ? docker run 54788ec314ca          // create and run by id
// ? docker run -it alexreshetnyak/posts sh         // create and run and run shell

// * docker start 54788ec314ca

// * docker exec -it 54788ec314ca sh // execute bash command inside docker container

// * docker logs 54788ec314ca // show logs from container
