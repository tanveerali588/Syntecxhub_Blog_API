const Post = require("../models/Post");


const createPost = async (req, res, next) => {
  try {
    const { title, body, author, tags } = req.body;

    const post = await Post.create({
      title,
      body,
      author,
      tags,
    });

    res.status(201).json({
      success: true,
      message: "Blog post created successfully",
      data: post,
    });
  } catch (error) {
    next(error);
  }
};


const getPosts = async (req, res, next) => {
  try {
    const {
      limit = 10,
      skip = 0,
      tag,
      author,
      date,
      sort = "newest",
    } = req.query;

    const filter = {};

    if (tag) {
      filter.tags = tag;
    }

    if (author) {
      filter.author = author;
    }

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);

      endDate.setDate(endDate.getDate() + 1);

      filter.createdAt = {
        $gte: startDate,
        $lt: endDate,
      };
    }

    const sortOrder = sort === "oldest" ? 1 : -1;

    const posts = await Post.find(filter)
      .sort({ createdAt: sortOrder })
      .skip(Number(skip))
      .limit(Number(limit));

    const total = await Post.countDocuments(filter);

    res.status(200).json({
      success: true,
      total,
      limit: Number(limit),
      skip: Number(skip),
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};


const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found",
      });
    }

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    next(error);
  }
};


const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Blog post updated successfully",
      data: post,
    });
  } catch (error) {
    next(error);
  }
};


const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Blog post deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
};