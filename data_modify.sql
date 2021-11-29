SELECT SETVAL((SELECT PG_GET_SERIAL_SEQUENCE('"reviews"', 'id')), (SELECT (MAX("id") + 1) FROM "reviews"), FALSE);
SELECT SETVAL((SELECT PG_GET_SERIAL_SEQUENCE('"reviews_photos"', 'id')), (SELECT (MAX("id") + 1) FROM "reviews_photos"), FALSE);
SELECT SETVAL((SELECT PG_GET_SERIAL_SEQUENCE('"characteristic_reviews"', 'id')), (SELECT (MAX("id") + 1) FROM "characteristic_reviews"), FALSE);