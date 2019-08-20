const multer = require('@koa/multer');
const upload = multer();

module.exports = (Models, router) => {
  router.get('/posts/get', async ctx => {
    const allPosts = await Models.Post.findAll();

    ctx.body = allPosts;
  });
  router.post('/posts/create', upload.single('image'), async ctx => {
    const allPosts = await Models.Post.findAll();
    console.log('ctx.request.files', ctx.request.files);
    console.log('ctx.files', ctx.files);
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
