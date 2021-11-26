const { Pool, Client } = require('pg');

const pool = new Pool({
  database: 'ratingsapi'
});

//Get reviews
//Get MetaReviews
//Put report
//Put helpfulness
//Post review

var getReviews = function(prodID, callback) {

  // reviews.id, reviews.rating, reviews.summary, reviews.response, reviews.body, reviews.date, reviews.reviewer_name, reviews.helpfullness
  pool.query('SELECT * FROM reviews WHERE product_id=$1', [prodID], function(err, resultsReviews) {
    if (err) {
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
            aResponse.photo = [];
            resultsPhotos.rows.forEach((aPhoto) => {
              if (aResponse.id === aPhoto.review_id) {
                aResponse.photo.push({id: aPhoto.id, url: aPhoto.url});
              }
            })
          })
        callback(null, {results});
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

      console.log('currentresults', results);

      callback(null,{results});
    }
  })

}

module.exports = {
  getReviews,
  getMetaReviews
};