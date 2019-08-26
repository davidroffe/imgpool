const path = require('path');
const rootPath = path.dirname(require.main.filename);
const multer = require('@koa/multer');
const upload = multer({ dest: rootPath + '/uploads' });

module.exports = (Models, router) => {
  router.get('/post/get', async ctx => {
    const allPosts = await Models.Post.findAll();

    ctx.body = allPosts;
  });
  router.post('/post/create', upload.single('image'), async ctx => {
    const allPosts = await Models.Post.findAll();
    const tags = ctx.query.tags;
    const source = ctx.query.source;
    ctx.body = allPosts;
  });
  router.post('/posts/delete', async ctx => {
    const allPosts = await Models.Post.findAll();

    ctx.body = allPosts;
  });
  router.post('/posts/addTag', async ctx => {
    const allPosts = await Models.Post.findAll();

    ctx.body = allPosts;
  });
};
