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
  title VARCHAR(128) NOT NULL,
  description VARCHAR(512),
  prep_time VARCHAR(32) NOT NULL,
  cook_time VARCHAR(32) NOT NULL,
  photo VARCHAR(128),
  creator VARCHAR(64) NOT NULL,
  owner VARCHAR(64) NOT NULL,
  creation_ts BIGINT NOT NULL,
  modification_ts BIGINT NOT NULL,
  rating REAL,
  FOREIGN KEY (creator) REFERENCES users(id),
  FOREIGN KEY (owner) REFERENCES users(id)
);

CREATE TABLE ingredients (
  recipe_id VARCHAR(64) NOT NULL,
  ingredient VARCHAR(128) NOT NULL,
  FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
);

CREATE TABLE instructions (
  recipe_id VARCHAR(64) NOT NULL,
  number INT NOT NULL,
  instruction VARCHAR(256) NOT NULL,
  FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
  unique(recipe_id, number)
);