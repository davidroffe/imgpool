const path = require('path');
const rootPath = path.dirname(require.main.filename);
const multer = require('@koa/multer');
const sizeOf = require('image-size');
const sharp = require('sharp');
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, rootPath + '/public/uploads');
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
  router.get('/post/list', async ctx => {
    const allPosts = await Models.Post.findAll();

    ctx.body = allPosts;
  });
  router.get('/post/single', async ctx => {
    const postId = ctx.query.id;
    const post = await Models.Post.findOne({ where: { id: postId } });

    ctx.body = post;
  });
  router.post('/post/create', upload.single('image'), async ctx => {
    const dimensions = sizeOf(ctx.file.path);
    const tags =
      typeof ctx.query.tags !== 'undefined' ? ctx.query.tags.split(' ') : '';
    const source =
      typeof ctx.query.source !== 'undefined' ? ctx.query.source : '';
    const newPost = await Models.Post.create({
      height: dimensions.height,
      width: dimensions.width,
      source: source,
      url: '/uploads/' + ctx.file.filename,
      thumbUrl: '/uploads/thumbnails/' + ctx.file.filename
    });

    for (var i = 0; i < tags.length; i++) {
      const [tag, created] = await Models.Tag.findOrCreate({
        where: { name: tags[i] },
        defaults: { active: true }
      });

      await Models.TaggedPost.create({
        postId: newPost.id,
        tagId: tag.id
      });
    }

    await sharp(ctx.file.path)
      .resize(200, 200, {
        fit: 'cover'
      })
      .toFile(ctx.file.destination + '/thumbnails/' + ctx.file.filename);

    ctx.body = { status: 'success' };
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
