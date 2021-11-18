\c ratingsapi;

\COPY reviews FROM './reviews.csv' WITH DELIMITER ',' CSV HEADER;

\COPY characteristics from './characteristics.csv' WITH DELIMITER ',' CSV HEADER;

\COPY characteristic_reviews from './characteristic_reviews.csv' WITH DELIMITER ',' CSV HEADER;

\COPY reviews_photos from './reviews_photos.csv' WITH DELIMITER ',' CSV HEADER;
