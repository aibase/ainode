const fs = require('fs');
const path = require('path');

const { validationResult } = require('express-validator');

const io = require('../socket');
const Post = require('../models/post');
const User = require('../models/user');

exports.getPosts = async (req, res, next) => {
  const currentPage = req.query.page || 1; // set page to 1 as a default
  const perPage = 2;  // Pagination w 2 posts per page same as in frontend 
  try {
    // Find total number of items in the database
    const totalItems = await Post.find().countDocuments();
    const posts = await Post.find()
      .populate('creator')
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    res.status(200).json({
      message: 'Fetched posts successfully.',
      posts: posts,
      totalItems: totalItems
    });
  } catch (err) {
    if (!err.statusCode) {
        err.statusCode = 500;
    }
    next(err);  // passing the err to error handler middleware  
  }
};

exports.createPost = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422; // validation failed status code = 422
    throw error;   
  }
  if (!req.file) {
    const error = new Error('No image file provided.');
    error.statusCode = 422;   // Validation error
    throw error;
  }
  // Multer was able to extract a valid file
  const imageUrl = req.file.path;
  const title = req.body.title;
  const content = req.body.content;
  // Create post in db + local storage ~ git repos
  const post = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
    creator: req.userId
  });
  try {
    await post.save();
    const user = await User.findById(req.userId);
    user.posts.push(post);  // adding post to the list of posts of the user
    await user.save();
    io.getIO().emit('posts', {
      action: 'create',
      post: { ...post._doc, creator: { _id: req.userId, name: user.name } }
    });      // emit() to all users / broadcast() to all -sender
    res.status(201).json({
      message: 'Post created successfully!',
      post: post,
      creator: { _id: user._id, name: user.name }
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);  // passing the err to error handler middleware
  }
};

exports.getPost = async (req, res, next) => { 
  const postId = req.params.postId;
  const post = await Post.findById(postId)
  try {
    if (!post) {
      const error = new Error('Could not find post.');
      error.statuscode = 404; // 404 - not found code
      throw error;
    }
    res.status(200).json({
      message: 'Post fetched.',
      post: post
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);  // passing the err to error handler middleware
  }
};

exports.updatePost = async (req, res, next) => {
  const postId = req.params.postId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422; // validation failed status code = 422
    throw error;   
  }
  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image;
  if (req.file) {
    imageUrl = req.file.path;
  }
  if (!imageUrl) {
    const error = new Error('No file picked.');
    error.statusCode = 422; // kind of validation failed status code = 422
    throw error;
  }
  // Update data in the database
  try {
    const post = await Post.findById(postId)
    if (!post) {
      const error = new Error('Could not find post.');
      error.statuscode = 404; // 404 - not found code
      throw error;
    }
    if (post.creator.toString() !== req.userId) {
      const error = new Error('Not authorized!')
      error.statusCode = 403;
      throw error;
    }
    if (imageUrl !== post.imageUrl) {
      clearImage(post.imageUrl);
    }
    post.title = title;
    post.imageUrl = imageUrl;
    post.content = content;
    const result = await post.save();
    res.status(200).json({ message: 'Post updated!', post: result });
  } catch (err) {
    if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);  // passing the err to error handler middleware
  }
};

exports.deletePost = async (req, res, next) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId)
    if (!post) {
      const error = new Error('Could not find post.');
      error.statuscode = 404; // 404 - not found code
      throw error;
    }
    if (post.creator.toString() !== req.userId) {
      const error = new Error('Not authorized!')
      error.statusCode = 403;
      throw error;
    }
    // Check logged in user is the creator
    clearImage(post.imageUrl);
    await Post.findByIdAndRemove(postId);
    const user = await User.findById(req.userId);
    user.posts.pull(postId);
    await user.save();
    res.status(200).json({ message: 'Deleted post.' });
  } catch (err) {
    if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);  // passing the err to error handler middleware
  }
};

const clearImage = filePath => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, err => console.log(err));
};