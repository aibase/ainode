const { validationResult } = require('express-validator');

const Post = require('../models/post');

exports.getPosts = (req, res, next) => {
    res.status(200).json({
      posts: [
        {
          _id: '1',
          title: 'First Post',
          content: 'This is the first post!',
          imageUrl: 'files/images/duck.jpg',
          creator: {
            name: 'Stefan'
          },
          createdAt: new Date()
        }
      ]
    });

    // Testing eval()
    // const test = eval('2+3');
    // console.log(test);

    // const cmd = eval(`console.log(res);`);
    // console.log(res);
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // console.log(errors);
    return res
      .status(422)
      .json({
        message: 'Validation failed, entered data is incorrect.',
        errors: errors.array()
      });   // validation failed status code = 422
  }
  const title = req.body.title;
  const content = req.body.content;
  // Create post in db + local storage ~ git repos
  const post = new Post({
    title: title,
    content: content,
    imageUrl: 'files/images/duck.jpg',
    creator: { name: 'Stefan' }
  });
  post.save().then(result => {
    console.log(result);
    res.status(201).json({
      message: 'Post created successfully!',
      post: result
  });
  }).catch(err => {
    console.log(err)
  });

};