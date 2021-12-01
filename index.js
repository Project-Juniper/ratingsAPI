const { Pool, Client } = require('pg');

// const pool = new Pool({
//   host: 'localhost',
//   database: 'ratingsapi'
// });

const pool = new Pool({
  user: 'test_user',
  host: '3.101.115.196',
  database: 'ratingsapi',
  password: 'password',
  port: 5432
});

//Get reviews
//Get MetaReviews
//Put report
//Put helpfulness
//Post review

var getReviews = function(prodID, count, page, sort, callback) {

  page = page === undefined ? 1 : page;
  count = count === undefined ? 5 : count;
  sort = sort === undefined ? 'relevant' : sort;

  let offset = 0;
  if (page > 1) {
    offset = count * (page -1);
  }

  let sortAlgo;

  switch (sort) {
    case 'newest':
      sortAlgo = 'date DESC';
      break;
    case 'helpful':
      sortAlgo = 'helpfullness DESC';
      break;
    default:
      sortAlgo = 'helpfullness DESC, date DESC';
      break;
  }

  // reviews.id, reviews.rating, reviews.summary, reviews.response, reviews.body, reviews.date, reviews.reviewer_name, reviews.helpfullness
  pool.query(`SELECT * FROM reviews WHERE product_id=$1 AND reviews.reported=$2 ORDER BY ${sortAlgo} OFFSET ${offset} LIMIT ${count}`, [prodID, false], function(err, resultsReviews) {
    if (err) {
      console.log(err);
      callback(err);
    } else {

      // let reviews = resultsReviews.rows;
      // let counter = 0;
      // reviews.forEach((aReview) => {
      //   pool.query(`SELECT reviews_photos.id, reviews_photos.url FROM reviews_photos WHERE reviews_photos.review_id = ${aReview.id}`, (err, photoResults) => {
      //     if(err) {
      //       callback(err);
      //     } else {
      //       aReview.photos = photoResults.rows.map((aPhoto) => ({ id: aPhoto.id, url: aPhoto.url }) );
      //       console.log('areview->', aReview);
      //       counter++;
      //     }
      //   })
      // });
      // while( counter !== reviews.length-1 ) {

      // }
      // callback(null, {results : reviews});

      pool.query('SELECT reviews_photos.id, reviews_photos.review_id, reviews_photos.url FROM reviews_photos INNER JOIN reviews ON reviews_photos.review_id = reviews.id WHERE reviews.product_id = $1', [prodID], function(err, resultsPhotos) {
        if(err) {
          callback(err);
        } else {
          let results =  resultsReviews.rows;
          results.forEach( (aResponse) =>  {
            aResponse.photos = [];
            aResponse['review_id'] = aResponse.id;
            aResponse['helpfulness'] = aResponse.helpfullness;
            delete aResponse.reported;
            delete aResponse.reviewer_email;
            delete aResponse.helpfullness;
            aResponse.response = aResponse.response === 'null' ? null : aResponse.response;
            aResponse.date = new Date(Number(aResponse.date)).toISOString();
            resultsPhotos.rows.forEach((aPhoto) => {
              if (aResponse.id === aPhoto.review_id) {
                aResponse.photos.push({id: aPhoto.id, url: aPhoto.url});
              }
            })
            delete aResponse.id;
          })
        callback(null, {'product': prodID, 'page': page, 'count': count, 'results' : results});
        };
    });
  }
})
};

var getMetaReviews = (id, callback) => {
  console.log(id);
  pool.query(`SELECT * FROM reviews INNER JOIN characteristic_reviews ON reviews.id = characteristic_reviews.review_id INNER JOIN characteristics ON characteristic_reviews.characteristic_id = characteristics.id WHERE reviews.product_id = ${id}`, (err, metaReviews) => {
    if(err) {
      callback(err, null);
    } else {
      let rawData = metaReviews.rows;
      let results = {
        "product_id": rawData[0].product_id,
        "ratings": {},
        "recommended": {},
        "characteristics": {}
      };
      let ratingsSet = new Set();
      let counter = 0;

      rawData.forEach( (aResponse) => {
        counter++;
        if(!ratingsSet.has(aResponse.review_id)) {
          ratingsSet.add(aResponse.review_id);
          if(results.ratings[aResponse.rating] === undefined) {
            results.ratings[aResponse.rating] = 1;
          } else {
            results.ratings[aResponse.rating]++;
          }
          if(results.recommended[aResponse.recommend] === undefined) {
            results.recommended[aResponse.recommend] = 1;
          } else {
            results.recommended[aResponse.recommend]++;
          }
        }
        if(results.characteristics[aResponse.name] === undefined) {
          results.characteristics[aResponse.name] = {
            "id": aResponse.characteristic_id,
            "value": aResponse.value,
            "_count": 5
          };
        } else {
          results.characteristics[aResponse.name].value = results.characteristics[aResponse.name].value / 5 * results.characteristics[aResponse.name]._count + aResponse.value;
          results.characteristics[aResponse.name]._count += 5;
          results.characteristics[aResponse.name].value = results.characteristics[aResponse.name].value / results.characteristics[aResponse.name]._count * 5;
          if(counter === rawData.length) {
            for (var item in results.characteristics) {
              delete results.characteristics[item]._count;
            }
          }
        }
      });

      callback(null,{results});
    }
  })

}

var postReview = (reqBody, callback) => {
  const {
    product_id, rating, recommend, photos, characteristics
  } = reqBody;
  let { summary, body, name, email } = reqBody;

  summary = summary.replace(`'`, "''");
  body = body.replace(/'/g, "''");
  name = name.replace(/'/g, "''");
  email = email.replace(/'/g, "''");


  let queryString = `INSERT INTO
  reviews (product_id, rating, date, summary, body, recommend, reviewer_name, reviewer_email)
  VALUES (${product_id}, ${rating}, ${Date.now()} ,'${summary}', '${body}', ${recommend}, '${name}', '${email}')
  RETURNING id`;

  console.log(queryString);

  pool.query(queryString, (err, results) => {
    if(err) {
      console.log(err);
      callback(err);
    } else {
      const currentReviewID = results.rows[0].id;
      if(Object.keys(characteristics).length > 0) {
        const constructCharQuery = (characteristics) => {
          const values = [];
          for (const key in characteristics) {
            values.push(`(${key}, ${currentReviewID}, ${characteristics[key]})`);
          }
          return values.join(',');
        }
        queryString = `INSERT INTO characteristic_reviews (characteristic_id, review_id, value)
        VALUES ${constructCharQuery(characteristics)}`;
        pool.query(queryString, (err) => {
          if (err) {
            callback(err);
          } else if (photos.length > 0) {
            const constructPhotosQuery = (photos) => {
              const values = [];
              photos.forEach((url) => {
                values.push(`(${currentReviewID}, '${url}')`);
              });
              return values.join(',');
            }

            const value = constructPhotosQuery(photos);

            queryString = `INSERT INTO
              reviews_photos (review_id, url)
              VALUES ${value}`;

            pool.query(queryString, (err) => {
              if(err){
                callback(err);
              } else {
                console.log('done!');
                callback();
              }
            });
          } else {
            console.log('done!');
            callback();
          }
        });
      } else {
        console.log('done!');
        callback();
      }
    }

  })

}

var addHelpfullness = (reviewID, callback) => {

  pool.query(`UPDATE reviews SET helpfullness = (helpfullness + 1) where id= ${reviewID}`, (err) => {
    if(err) {
      console.log(err);
      callback(err);
    } else {
      callback();
    }
  });
}

var reportReview = (reviewID, callback) => {
  pool.query(`UPDATE reviews SET reported = true WHERE id= ${reviewID}`, (err) => {
    if(err) {
      console.log(err);
      callback(err);
    } else {
      callback();
    }
  })
}

module.exports = {
  getReviews,
  getMetaReviews,
  postReview,
  addHelpfullness,
  reportReview,
  pool,
};
