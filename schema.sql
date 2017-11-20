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
  prepTime VARCHAR(32) NOT NULL,
  cookTime VARCHAR(32) NOT NULL,
  photo VARCHAR(128),
  creator VARCHAR(64) NOT NULL,
  owner VARCHAR(64) NOT NULL,
  creationDate VARCHAR(32) NOT NULL,
  modificationDate VARCHAR(32) NOT NULL,
  rating REAL,
  FOREIGN KEY (creator) REFERENCES users(id),
  FOREIGN KEY (owner) REFERENCES users(id)
);

CREATE TABLE ingredients (
  recipeId VARCHAR(64) NOT NULL,
  ingredient VARCHAR(128) NOT NULL,
  FOREIGN KEY (recipeId) REFERENCES recipes(id)
);

CREATE TABLE instructions (
  recipeId VARCHAR(64) NOT NULL,
  number INT NOT NULL,
  instruction VARCHAR(256) NOT NULL,
  FOREIGN KEY (recipeId) REFERENCES recipes(id),
  unique(recipeId, number)
);