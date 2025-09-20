import { Client } from "pg";
import "dotenv/config";

const create_tables = `
CREATE EXTENSION citext;

CREATE TABLE IF NOT EXISTS users (
userId INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
email citext UNIQUE NOT NULL,
username VARCHAR(100) NOT NULL,
password VARCHAR(100) NOT NULL,
isAdmin BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS posts (
postId INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
userId INT NOT NULL REFERENCES users(userId),
title VARCHAR(100) NOT NULL,
description TEXT NOT NULL,
likes INT NOT NULL DEFAULT 0,
date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS comments (
commentId INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
parent_commentId INT REFERENCES comments(commentId),
userId INT NOT NULL REFERENCES users(userId),
comment VARCHAR(500) NOT NULL,
date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS post_likes (
userId INT NOT NULL REFERENCES users(userId),
postId INT NOT NULL REFERENCES posts(postId),
time_liked TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY (userId, postId)
);
`;

const seed = `
INSERT INTO users (email, username, password, isAdmin) VALUES ('example@gmail.com', 'John Smith', '1234', true);
INSERT INTO posts (userId, title, description, likes) VALUES (1, 'Sample Title', 'This is the sample description for this sample post', 1);
INSERT INTO comments (userId, comment) VALUES (1, 'This is the sample comment on the sample post');
INSERT INTO post_likes (userId, postId) VALUES (1, 1);
`;

async function main() {
  console.log("Seeding...");
  const client = new Client({
    connectionString: `postgresql://${process.env.ROLE_NAME}@localhost:5432/${process.env.DATABASE_NAME}`,
  });
  await client.connect();
  await client.query(create_tables);
  await client.query(seed);
  await client.end();
  console.log("Seeding Complete");
}
main();
