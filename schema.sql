-- DROP DATABASE IF EXISTS ratingsapi;

-- CREATE DATABASE ratingsapi;

-- SET SCHEMA 'ratingsapi';
\c ratingsapi;

DROP TABLE IF EXISTS reviews_photos CASCADE;
DROP TABLE IF EXISTS characteristic_reviews CASCADE;
DROP TABLE IF EXISTS characteristics CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;

CREATE TABLE reviews (
  id INTEGER GENERATED ALWAYS AS IDENTITY NOT NULL PRIMARY KEY,
  product_id INTEGER  NOT NULL,
  rating INTEGER NOT NULL,
  date BIGINT NOT NULL,
  summary VARCHAR(150),
  body TEXT,
  recommend BOOLEAN,
  reported BOOLEAN,
  reviewer_name VARCHAR(100),
  reviewer_email VARCHAR(100),
  response TEXT,
  helpfullness INTEGER NOT NULL
);


CREATE TABLE reviews_photos (
  id INTEGER GENERATED ALWAYS AS IDENTITY NOT NULL PRIMARY KEY,
  review_id INTEGER REFERENCES reviews (id),
  url TEXT
);

CREATE TABLE characteristics (
  id INTEGER GENERATED ALWAYS AS IDENTITY NOT NULL PRIMARY KEY,
  product_id INTEGER NOT NULL,
  name VARCHAR(50)
);

CREATE TABLE characteristic_reviews (
  id INTEGER GENERATED ALWAYS AS IDENTITY NOT NULL PRIMARY KEY,
  characteristic_id INTEGER REFERENCES characteristics (id),
  review_id INTEGER REFERENCES reviews (id),
  value INTEGER NOT NULL
);


