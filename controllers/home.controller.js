import { body, query, validationResult } from "express-validator";

export const getHome = async (req, res) => {
  //console.log(req.headers);
  const now = new Date();
  try {
    res.render("index", {
      likedPosts: '',
      myPosts: '',
      query: '',
      time: `${
        now.getMonth() + 1
      }/${now.getDate()}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`,
    });
  } catch (error) {
    console.error("Error in getHome controller: ", error);
  }
};

export const getPostForm = (req, res) => {
  res.redirect();
};

export const postPostForm = (req, res) => {

};

export const getPost = async (req, res) => {
  try {
    res.render("post.ejs", {
      title: "",
      post: "",
    });
  } catch (error) {
    console.error("Error in getPost controller: ", error);
  }
};
