import bodyParser from 'body-parser';
import express from 'express';
import axios from 'axios';

const app = express();
app.use(bodyParser.json());

const events = [];

app.post('/events', (req, res) => {
  const event = req.body;
  
  events.push(event);

  axios.post('http://posts-clusterip-srv:4000/events', event);
  axios.post('http://comments-srv:4001/events', event);
  axios.post('http://query-srv:4002/events', event);
  axios.post('http://moderation-srv:4003/events', event);

  res.send({ status: 'OK' });
});

app.get('/events', (req, res) => {
  res.send(events);
})

app.listen(4005, () => {
  console.log('Events-bus listening on port: 4005');
});
