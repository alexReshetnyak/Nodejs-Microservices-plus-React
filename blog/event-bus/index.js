import bodyParser from 'body-parser';
import express from 'express';
import axios from 'axios';

const app = express();
app.use(bodyParser.json());


app.post('/events', (req, res) => {
  const event = req.body;
  
  axios.post('http://localhost:4000/events', event);
  axios.post('http://localhost:4001/events', event);
  axios.post('http://localhost:4002/events', event);
  axios.post('http://localhost:4003/events', event);

  res.send({ status: 'OK' });
});

app.listen(4005, () => {
  console.log('Events-bus listening on port: 4005');
});
