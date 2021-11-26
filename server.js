const express = require('express');
const cors = require('cors');
const db = require('./index.js');
const URL = 'localhost:8080';

const app = express();
const PORT = 8080 || process.env.PORT;

app.use(express.json());
app.use(cors());


app.get('/reviews/', (req, res) => {
  const { page, sort, id } = req.query;
  const url = `${URL}/reviews/?page=${page}&count=100&sort=${sort}&product_id=${id}`;
  console.log('test');

  db.getReviews(id, (err, response) => {
    if(err) {
      res.status(400).send('Error getting data');
    } else {
      console.log(response);
      response.product = id;
      response.page = page;
      response.count = 5;
      res.status(200).json(response);
    }
  })

});

app.get('/reviews/meta', (req,res) => {
  const { id } = req.query;
  const url = `${URL}/reviews/?meta/?product_id=${id}`;
  console.log('reviewsMeta test');
  db.getMetaReviews(id, (err, response) => {
    if(err) {
      res.status(400).send('Error getting data');
    } else {
      res.status(200).json(response.results);
    }
  });
});

app.listen(PORT, () => {
 console.log('Server listening on port:', `${PORT}`);
});