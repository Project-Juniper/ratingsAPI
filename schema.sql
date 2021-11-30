DROP DATABASE IF EXISTS ratingsapi;

CREATE DATABASE ratingsapi;

-- SET SCHEMA 'ratingsapi';  -> change varchar()
\c ratingsapi;

DROP TABLE IF EXISTS reviews_photos CASCADE;
DROP TABLE IF EXISTS characteristic_reviews CASCADE;
DROP TABLE IF EXISTS characteristics CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;

CREATE TABLE reviews (
	id INTEGER GENERATED BY DEFAULT AS IDENTITY UNIQUE PRIMARY KEY,
  product_id INTEGER  NOT NULL,
  rating SMALLINT NOT NULL,
  date BIGINT NOT NULL,
  summary VARCHAR(255),
  body VARCHAR(1000),
  recommend BOOLEAN NOT NULL DEFAULT FALSE,
  reported BOOLEAN NOT NULL DEFAULT FALSE,
  reviewer_name VARCHAR(40),
  reviewer_email VARCHAR(40),
  response VARCHAR(255) DEFAULT NULL,
  helpfullness INTEGER NOT NULL DEFAULT 0
) WITH (
  OIDS = FALSE
);

CREATE INDEX product_id_idx ON reviews (product_id);

CREATE TABLE reviews_photos (
  id INTEGER GENERATED BY DEFAULT AS IDENTITY UNIQUE PRIMARY KEY,
  review_id INTEGER REFERENCES reviews (id),
  url VARCHAR(255)
) WITH (
  OIDS = FALSE
);

CREATE INDEX review_id_idx ON reviews_photos (review_id);

CREATE TABLE characteristics (
  id INTEGER GENERATED BY DEFAULT AS IDENTITY UNIQUE PRIMARY KEY,
  product_id INTEGER NOT NULL,
  name VARCHAR(20)
) WITH (
  OIDS = FALSE
);

CREATE TABLE characteristic_reviews (
  id INTEGER GENERATED BY DEFAULT AS IDENTITY UNIQUE PRIMARY KEY,
  characteristic_id INTEGER REFERENCES characteristics (id),
  review_id INTEGER REFERENCES reviews (id),
  value SMALLINT NOT NULL
) WITH (
  OIDS = FALSE
);
CREATE INDEX review_id2_idx ON characteristic_reviews (review_id);
CREATE INDEX characteristic_id_idx ON characteristic_reviews (characteristic_id);