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
    const test = eval('2+3');
    console.log(test);

    const cmd = eval(`console.log(res);`);
    // console.log(res);
};

exports.createPost = (req, res, next) => {
    const title = req.body.title;
    const content = req.body.content;
    // console.log(title, content);
    // Create post in db + local storage / git repos
    res.status(201).json({
        message: 'Post created successfully!',
        post: {
            id: new Date().toISOString(), 
            title: title, 
            content: content}
    });
}