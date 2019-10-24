const express = require('express');
const { check } = require('express-validator');
// const { body } = require('express-validator/check'); // per Max

const feedController = require('../controllers/feed');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// GET /feed/posts
router.get('/posts', isAuth, feedController.getPosts);

// POST /feed/post - create a Post
router.post('/post',
  [
  check('title')
    .trim()
    .isLength({ min: 5 }),
  check('content')
    .trim()
    .isLength({ min: 5 })
  ],
  feedController.createPost
);

router.get('/post/:postId', feedController.getPost);

router.put('/post/:postId',
  [
  check('title')
    .trim()
    .isLength({ min: 5 }),
  check('content')
    .trim()
    .isLength({ min: 5 })
  ], feedController.updatePost
);

router.delete('/post/:postId', feedController.deletePost);

module.exports = router;