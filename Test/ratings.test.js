const supertest = require('supertest');
const { app } = require('../server.js');
const { pool } = require('../index.js');
const { Pool, Client } = require('pg');

const api = supertest(app);
const productId = '?product_id=';
const sort = '&sort=';
const count = '&count=';

// beforeAll(() => {

//   // pool.query('DELETE TABLE IF EXISTS reviews', (err) => {
//   //   if(err) {
//   //     throw err;
//   //   } else {
//   //     console.log('deleted table successfully');
//   //   }
//   // });
// });

afterAll((done) => {
  pool.end();
  done();
})

describe('Basic request implementation and server response codes', () => {

  test('It should successfully retrieve a review with status code 200', async () => {
    await api
    .get('/reviews/?product_id=1&sort=newest')
    .expect(200)
  });

  test('It should successfully retrieve a meta review with a status code 200', async() => {
    await api
    .get('/reviews/meta/?product_id=1')
    .expect(200)
  });

  test('It should successfully update a review\'s helpfulness with status code 204', async () => {

    let before = await api.get('/reviews/?product_id=1&sort=newest');
    let review_id = before.body.results[0].review_id;

    const response = await api.put(`/reviews/${review_id}/helpful`)
      .send({'review_id': review_id})
      .expect(204);
    });

    test('It should be able to successfully post a new review with status code 201', async() => {
      await api
      .post('/reviews')
      .send({
        "product_id": 1,
        "rating": 4,
        "summary": "TE'STs",
        "body": "Its just a test's",
        "recommend": true,
        "name": "test",
        "email": "test123@hotmail.com",
        "photos": [],
        "characteristics": {}
      })
      .expect(201);
  })


  test('It should be able to report a review with status code 204', async() => {
    await api
    .post('/reviews')
    .send({
      "product_id": 1,
      "rating": 4,
      "summary": "TE'STs",
      "body": "Its just a test's",
      "recommend": true,
      "name": "test",
      "email": "test123@hotmail.com",
      "photos": [],
      "characteristics": {}
    })
    .expect(201);

    let before = await api.get('/reviews/?product_id=1&sort=newest');
    let review_id = before.body.results[0].review_id;

    const response = await api.put(`/reviews/${review_id}/report`)
    .send({'review_id': review_id})
    .expect(204);
  });

});


describe('Write a new review, update helpfullness in newly written review', () => {

  test('It should be abel to successfully post a new review', async() => {
    await api
    .post('/reviews')
    .send({
      "product_id": 1,
      "rating": 4,
      "summary": "TE'STs",
      "body": "Its just a test's",
      "recommend": true,
      "name": "test",
      "email": "test123@hotmail.com",
      "photos": [],
      "characteristics": {}
    })
    .expect(201);
})

  let beforeHelpfullness;

  test('It should be able to update the helpfulness in the newly posted review', async () => {

  let before = await api.get('/reviews/?product_id=1&sort=newest');
  let review_id = before.body.results[0].review_id;
  beforeHelpfullness = before.body.results[0].helpfulness;
  expect(beforeHelpfullness).toBe(0);

  const response = await api.put(`/reviews/${review_id}/helpful`)
    .send({'review_id': review_id})
    .expect(204);
  })

  test('It should be able to retrieve and verify that the new review has its helpfulness updated', async () => {
    let after = await api.get('/reviews/?product_id=1&sort=newest')
      .expect(200);
    let afterHelpfullness = after.body.results[0].helpfulness;
    expect(afterHelpfullness).toBe(beforeHelpfullness + 1);
  })

})

describe('Reviews sorting methods', () => {

  it('should sort by helpfulness', async () => {
    const response = await api.get(`/reviews${productId}61618${sort}helpful`);
    const helpfulness = [];
    for (let i = 0; i < response.body.results.length; i += 1) {
      helpfulness.push(response.body.results[i].helpfulness);
    }
    const answer = [...helpfulness].sort((a, b) => b - a);
    expect(helpfulness).toEqual(answer);
  });

  it('should sort by newest', async () => {
    const response = await api.get(`/reviews${productId}61618${sort}newest`);
    const date = [];
    for (let i = 0; i < response.body.results.length; i += 1) {
      date.push(response.body.results[i].data);
    }
    const answer = [...date].sort((a, b) => b - a);
    expect(date).toEqual(answer);
  });

})


it('should return 10 reviews when the count query is used', async () => {
  const response = await api.get(`/reviews${productId}1${count}10`);
  expect(response.body.results.length).toBe(10);
});