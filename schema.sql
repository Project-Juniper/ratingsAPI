-- DROP DATABASE IF EXISTS ratingsapi;

-- CREATE DATABASE ratingsapi;

-- SET SCHEMA 'ratingsapi';  -> change varchar()
\c ratingsapi;

DROP TABLE IF EXISTS reviews_photos CASCADE;
DROP TABLE IF EXISTS characteristic_reviews CASCADE;
DROP TABLE IF EXISTS characteristics CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;

CREATE TABLE reviews (
  id INTEGER GENERATED ALWAYS AS IDENTITY NOT NULL PRIMARY KEY,
  product_id INTEGER  NOT NULL,
  rating SMALLINT NOT NULL,
  date BIGINT NOT NULL,
  summary TEXT,
  body TEXT,
  recommend BOOLEAN,
  reported BOOLEAN DEFAULT FALSE,
  reviewer_name VARCHAR(40),
  reviewer_email VARCHAR(40),
  response TEXT,
  helpfullness INTEGER DEFAULT 0
);

CREATE INDEX product_id_idx ON reviews (product_id);
CREATE INDEX review_id_idx ON reviews_photos (review_id);

CREATE TABLE reviews_photos (
  id INTEGER GENERATED ALWAYS AS IDENTITY NOT NULL PRIMARY KEY,
  review_id INTEGER REFERENCES reviews (id),
  url TEXT
);

CREATE TABLE characteristics (
  id INTEGER GENERATED ALWAYS AS IDENTITY NOT NULL PRIMARY KEY,
  product_id INTEGER NOT NULL,
  name VARCHAR(20)
);

CREATE TABLE characteristic_reviews (
  id INTEGER GENERATED ALWAYS AS IDENTITY NOT NULL PRIMARY KEY,
  characteristic_id INTEGER REFERENCES characteristics (id),
  review_id INTEGER REFERENCES reviews (id),
  value INTEGER NOT NULL
);

CREATE INDEX characteristic_id_idx ON characteristic_reviews (characteristic_id);


