import { randomBytes } from 'crypto';
import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();

app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', async (req, res) => {
  const commentId = randomBytes(4).toString('hex');
  const { content } = req.body;
  const comments = commentsByPostId[req.params.id] || [];
  const newComment = {
    id: commentId,
    postId: req.params.id,
    content,
    status: 'pending'
  };

  comments.push(newComment);
  commentsByPostId[req.params.id] = comments;

  await axios.post('http://event-bus-srv:4005/events', {
    type: 'CommentCreated',
    data: newComment
  }); 

  res.status(201).send(comments);
});

app.post('/events', async (req, res) => {
  console.log('Received event:', req.body);

  const { type, data } = req.body;

  if (type === 'CommentModerated') {
    const { postId, id, status, content } = data;

    const comments = commentsByPostId[postId];
    const comment = comments.find(comment => comment.id === id);
    comment.status = status;

    await axios.post('http://event-bus-srv:4005/events', {
      type: 'CommentUpdated',
      data: {
        id,
        status,
        postId,
        content
      }
    });
  }

  res.send({});
});

app.listen(4001, () => {
  console.log('Comments service listening on port: 4001');
});
