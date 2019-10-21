const express = require('express');
// const { body } = require('express-validator/check'); // per Max
const { check } = require('express-validator');

const feedController = require('../controllers/feed');

const router = express.Router();

// GET /feed/posts
router.get('/posts', feedController.getPosts);

// POST /feed/post - create a Post
router.post('/post', [
  check('title').trim().isLength({min: 5}),
  check('content').trim().isLength({min: 5})
], feedController.createPost);

module.exports = router;