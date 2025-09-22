import { body, query, validationResult } from "express-validator";
import pool from "../config/db.config.js";

const validatePost = [
  body("title")
    .notEmpty()
    .isString()
    .isLength({ min: 2, max: 100 })
    .withMessage("Must be a string between 2 and 100 words"),
  body("description")
    .notEmpty()
    .isString()
    .isLength({ min: 2, max: 500 })
    .withMessage("Must be a string between 2 and 500 words"),
];

const validateComment = [
  body("addComment")
    .notEmpty()
    .isString()
    .isLength({ min: 2, max: 500 })
    .withMessage("Must be a string between 2 and 500 words"),
];

export const getHome = async (req, res) => {
  const likedPosts = await pool.query(
    `SELECT postid, title FROM posts
    WHERE postid = (SELECT postid FROM post_likes WHERE userid = $1);`,
    [res.locals.currentUser.userid]
  );
  const myPosts = await pool.query(
    "SELECT postid, title FROM posts WHERE userid = $1;",
    [res.locals.currentUser.userid]
  );
  const query =
    await pool.query(`SELECT posts.userid, postid, COALESCE(COUNT(commentid), 0) as num_of_comments, title, description, likes, posts.date_created as date_created
    FROM posts
    LEFT JOIN comments USING (postid)
    GROUP BY postid;`);
  //console.log(req.headers);
  const now = new Date();
  try {
    res.render("index", {
      likedPosts: likedPosts.rows,
      myPosts: myPosts.rows,
      query: query.rows,
      time: `${
        now.getMonth() + 1
      }/${now.getDate()}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`,
    });
  } catch (error) {
    console.error("Error in getHome controller: ", error);
  }
};

export const getPostForm = (req, res) => {
  res.render("postform");
};

export const postPostForm = [
  validatePost,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      return res.status(400).render("postform", {
        errors:
          errors.array() /* TAKE THIS ARRAY AND DISPLAY ERROR MESSAGES NEXT TO INPUT */,
      });
    }
    try {
      await pool.query(
        "INSERT INTO posts (userId, title, description) VALUES ($1, $2, $3)",
        [res.locals.currentUser.userid, req.body.title, req.body.description]
      );
      res.redirect("/");
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
];

export const getPost = async (req, res) => {
  const likedPosts = await pool.query(
    `SELECT postid, title FROM posts
    WHERE postid = (SELECT postid FROM post_likes WHERE userid = $1);`,
    [res.locals.currentUser.userid]
  );
  const myPosts = await pool.query(
    "SELECT postid, title FROM posts WHERE userid = $1;",
    [res.locals.currentUser.userid]
  );
  const mainPost = await pool.query(
    `
    SELECT postid, userid, username, title, description, likes, date_created
    FROM posts
    JOIN users USING (userid)
    WHERE postid = $1;
    `,
    [req.params.id]
  );
  const comments = await pool.query(
    `
    SELECT userid, username, comment FROM comments 
    JOIN users USING (userid)
    WHERE postid = $1;
    `,
    [req.params.id]
  );
  try {
    res.render("post", {
      likedPosts: likedPosts.rows,
      myPosts: myPosts.rows,
      post: mainPost.rows[0],
      comments: comments.rows,
    });
  } catch (error) {
    console.error("Error in getPost controller: ", error);
  }
};

export const postComment = [
  validateComment,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      return res.status(400).render(`/post/${req.params.id}`, {
        errors:
          errors.array() /* TAKE THIS ARRAY AND DISPLAY ERROR MESSAGES NEXT TO INPUT */,
      });
    }
    try {
      await pool.query(
        `
        INSERT INTO comments (userid, postid, comment) VALUES ($1, $2, $3)
        `,
        [res.locals.currentUser.userid, req.params.id, req.body.addComment]
      );
      await pool.query(
        `
        INSERT INTO post_likes (userid, postid) VALUES ($1, $2)
        `,
        [res.locals.currentUser.userid, req.params.id]
      );
      res.redirect(`/post/${req.params.id}`);
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
];
