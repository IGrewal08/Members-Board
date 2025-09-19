import { ExpressValidator, validationResult } from "express-validator";

export const getHome = async (req, res) => {
    try {
        res.render("index.ejs", {
            title: "",
            posts: "",
        });
    } catch (error) {
        console.error("Error in getHome controller: ", error);
    }
}

export const getPostForm = (req, res) => {
    res.redirect();
}

export const getPost = async (req, res) => {
    try {
        res.render("post.ejs", {
            title: "",
            post: "",
        });
    } catch (error) {
        console.error("Error in getPost controller: ", error);
    }
}