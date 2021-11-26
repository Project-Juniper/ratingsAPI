\c ratingsapi;
\timing

SELECT * FROM reviews INNER JOIN characteristic_reviews ON reviews.id = characteristic_reviews.review_id INNER JOIN characteristics ON characteristics.id = characteristic_reviews.characteristic_id WHERE reviews.product_id = 1;
-- SELECT reviews_photos.id, reviews_photos.review_id, reviews_photos.url FROM reviews_photos INNER JOIN reviews ON reviews_photos.review_id = reviews.id WHERE reviews.product_id = 61575;

