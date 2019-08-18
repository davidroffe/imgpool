const Models = require('../models');

module.exports = router => {
  router.get('/posts', async ctx => {
    const allPosts = await Models.Post.findAll();

    ctx.body = allPosts;
  });
};
