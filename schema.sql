CREATE TABLE users (
  id VARCHAR(64) PRIMARY KEY,
  username VARCHAR(128),
  displayname VARCHAR(128),
  photo VARCHAR(128)
);

CREATE TABLE relations (
  consumer VARCHAR(64),
  producer VARCHAR(64),
  unique(consumer, producer)
);

CREATE TABLE recipes (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(128),
  description VARCHAR(512),
  prep_time VARCHAR(32),
  cook_time VARCHAR(32),
  photo VARCHAR(128),
  creator VARCHAR(64),
  owner VARCHAR(64),
  creation_ts BIGINT,
  modification_ts BIGINT,
  rating REAL,
  FOREIGN KEY (creator) REFERENCES users(id),
  FOREIGN KEY (owner) REFERENCES users(id)
);

CREATE TABLE ingredients (
  recipe_id VARCHAR(64),
  ingredient VARCHAR(128),
  FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
);

CREATE TABLE instructions (
  recipe_id VARCHAR(64),
  number INT,
  instruction VARCHAR(256),
  FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
  unique(recipe_id, number)
);