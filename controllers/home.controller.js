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
  let likedPosts = [];
  let myPosts = [];
  if (res.locals.currentUser) {
    const likedPostsResponse = await pool.query(
      `SELECT postid, title FROM posts
    WHERE postid = (SELECT postid FROM post_likes WHERE userid = $1);`,
      [res.locals.currentUser.userid]
    );
    likedPosts = likedPostsResponse.rows;
    const myPostsResponse = await pool.query(
      "SELECT postid, title FROM posts WHERE userid = $1;",
      [res.locals.currentUser.userid]
    );
    myPosts = myPostsResponse.rows;
  }
  let baseQuery = `
    SELECT posts.userid, postid, COALESCE(COUNT(commentid), 0) as num_of_comments, title, description, likes, posts.date_created as date_created
    FROM posts
    LEFT JOIN comments USING (postid)
    GROUP BY postid
    `;
  if (req.query.sort === "popular") {
    baseQuery += " ORDER BY num_of_comments DESC";
  } else if (req.query.sort === "new") {
    baseQuery += " ORDER BY date_created DESC";
  } else if (req.query.sort === "ml") {
    baseQuery += " ORDER BY likes DESC";
  }
  const query = await pool.query(baseQuery);
  const now = new Date();
  try {
    res.render("index", {
      likedPosts: likedPosts,
      myPosts: myPosts,
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
        errors: errors.array(),
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

export const postComment = [
  validateComment,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      return res.status(400).render(`/post/${req.params.id}`, {
        errors: errors.array(),
      });
    }
    try {
      await pool.query(
        `
        INSERT INTO comments (userid, postid, comment) VALUES ($1, $2, $3)
        `,
        [res.locals.currentUser.userid, req.params.id, req.body.addComment]
      );
      res.redirect(`/post/${req.params.id}`);
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
];

export const getLike = async (req, res, next) => {
  const postId = req.params.id;
  const condition = req.params.condition;
  try {
    if (condition === "T") {
      await pool.query(
        `
        DELETE FROM post_likes WHERE userid = $1 AND postid = $2
        `,
        [res.locals.currentUser.userid, postId]
      );
      await pool.query("UPDATE posts SET likes = likes - 1 WHERE postid = $1", [
        postId,
      ]);
    } else if (condition === "F") {
      await pool.query(
        `
        INSERT INTO post_likes (userid, postid) VALUES ($1, $2)
        `,
        [res.locals.currentUser.userid, postId]
      );
      await pool.query("UPDATE posts SET likes = likes + 1 WHERE postid = $1", [
        postId,
      ]);
    } else {
      console.error("Invalid condition");
    }
    res.redirect(`/post/${postId}`);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getPost = async (req, res) => {
  let likedPosts = [];
  let myPosts = [];
  let likeValidationResponse;
  if (res.locals.currentUser) {
    const likedPostsResponse = await pool.query(
      `SELECT postid, title FROM posts
    WHERE postid = (SELECT postid FROM post_likes WHERE userid = $1);`,
      [res.locals.currentUser.userid]
    );
    likedPosts = likedPostsResponse.rows;
    const myPostsResponse = await pool.query(
      "SELECT postid, title FROM posts WHERE userid = $1;",
      [res.locals.currentUser.userid]
    );
    myPosts = myPostsResponse.rows;

    likeValidationResponse = await pool.query(
      `SELECT * FROM post_likes WHERE userid = $1 AND postid = $2
    `,
      [res.locals.currentUser.userid, req.params.id]
    );
  }
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
    SELECT userid, username, comment, date_created FROM comments 
    JOIN users USING (userid)
    WHERE postid = $1;
    `,
    [req.params.id]
  );

  const condition =
    likeValidationResponse != undefined &&
    likeValidationResponse.rows.length != 0
      ? "T"
      : "F";
  try {
    res.render("post", {
      condition: condition,
      likedPosts: likedPosts,
      myPosts: myPosts,
      post: mainPost.rows[0],
      comments: comments.rows,
    });
  } catch (error) {
    console.error("Error in getPost controller: ", error);
  }
};
