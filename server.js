const express = require('express');
const cors = require('cors');
const db = require('./index.js');
const URL = 'localhost:8080';

const app = express();
const PORT = 8080 || process.env.PORT;

app.use(express.json());
app.use(express.static(__dirname + '/../client/dist'));
app.use(cors());


app.get('/reviews/', (req, res) => {
  const { page, sort, product_id, count } = req.query;
  console.log('count', count);
  const url = `${URL}/reviews/?page=${page}&count=${count}&sort=${sort}&product_id=${product_id}`;

  db.getReviews(product_id, count, page, sort, (err, response) => {
    if(err) {
      res.status(400).send('Error getting data');
    } else {
      // response.product = id;
      // response.page = page;
      // response.count = 5;
      res.status(200).json(response);
    }
  })

});

app.get('/reviews/meta', (req,res) => {
  console.log(req.query);
  const { product_id } = req.query;
  const url = `${URL}/reviews/?meta/?product_id=${product_id}`;
  console.log('reviewsMeta test');
  db.getMetaReviews(product_id, (err, response) => {
    if(err) {
      res.status(400).send('Error getting data');
    } else {
      res.status(200).json(response.results);
    }
  });
});

app.post('/reviews/', (req, res) => {
  const reqBody = req.body;
  console.log('reviews POST TEST');
  db.postReview(reqBody, (err, response) => {
    if(err) {
      res.status(400).send('Error posting data');
    } else {
      res.status(201).send('Successfully posted data');
    }
  })
})

app.put('/reviews/:review_id/helpful', (req, res) => {
  console.log('ive been called', req.params);
  db.addHelpfullness(req.params['review_id'], (err) => {
    if(err) {
      res.status(500).send(err);
    } else {
      res.status(204).send('added 1 to helpfulness');
    }
  })
})

app.put('/reviews/:review_id/report', (req, res) => {
  console.log('ive been called', req.params);
  db.reportReview(req.params['review_id'], (err) =>{
    if(err) {
      res.status(500).send(err);
    } else {
      res.status(204).send('reported');
    }
  })
});

app.listen(PORT, () => {
 console.log('Server listening on port:', `${PORT}`);
});

module.exports = { app };