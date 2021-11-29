\c ratingsapi;
\timing

SELECT * FROM reviews INNER JOIN characteristic_reviews ON reviews.id = characteristic_reviews.review_id INNER JOIN characteristics ON characteristics.id = characteristic_reviews.characteristic_id WHERE reviews.product_id = 1;
-- SELECT reviews_photos.id, reviews_photos.review_id, reviews_photos.url FROM reviews_photos INNER JOIN reviews ON reviews_photos.review_id = reviews.id WHERE reviews.product_id = 61575;

-- INSERT INTO
--   reviews (product_id, rating, date, summary, body, recommend, reviewer_name, reviewer_email)
--   VALUES (1, 2, 1638074106558 ,'test', 'test', TRUE, 'asdf', 'smth');

-- SELECT * FROM reviews WHERE reviews.product_id = 1;