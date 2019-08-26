const path = require('path');
const rootPath = path.dirname(require.main.filename);
const multer = require('@koa/multer');
const sizeOf = require('image-size');
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, rootPath + '/uploads');
  },
  filename: function(req, file, cb) {
    cb(
      null,
      file.fieldname + '-' + Date.now() + '.' + file.mimetype.split('/')[1]
    );
  }
});
const upload = multer({ storage: storage });

module.exports = (Models, router) => {
  router.get('/post/get', async ctx => {
    const allPosts = await Models.Post.findAll();

    ctx.body = allPosts;
  });
  router.post('/post/create', upload.single('image'), async ctx => {
    const dimensions = sizeOf(ctx.file.path);
    const tags = ctx.query.tags;
    const source = ctx.query.source;
    const newPost = await Models.Post.create({
      height: dimensions.height,
      width: dimensions.width,
      source: source,
      url: '/uploads/' + ctx.file.filename
    });

    ctx.body = newPost;
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
