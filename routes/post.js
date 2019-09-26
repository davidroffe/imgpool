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
    const allPosts = await Models.Post.findAll({
      include: {
        model: Models.Tag,
        as: 'tag',
        required: false,
        attributes: ['id', 'name']
      }
    });

    ctx.body = allPosts;
  });
  router.get('/post/flag/get', async ctx => {
    const allFlags = await Models.Flag.findAll({
      include: {
        model: Models.Post,
        as: 'post'
      }
    });

    ctx.body = allFlags;
  });
  router.get('/post/single', async ctx => {
    const postId = ctx.query.id;
    const post = await Models.Post.findOne({
      where: { id: postId },
      include: {
        model: Models.Tag,
        as: 'tag',
        required: false,
        attributes: ['id', 'name']
      }
    });

    ctx.body = post;
  });

  router.post('/post/create', upload.single('image'), async ctx => {
    const tags =
      typeof ctx.query.tags !== 'undefined' ? ctx.query.tags.split(' ') : [];
    const source =
      typeof ctx.query.source !== 'undefined' ? ctx.query.source : '';

    let errorRes = {
      status: 401,
      message: []
    };

    if (!ctx.file) {
      errorRes.message.push('Please select a file.');
    }
    if (!tags.length) {
      errorRes.message.push(
        'Minimum 4 space separated tags. ie: red race_car bmw m3'
      );
    }

    if (!errorRes.message.length) {
      const dimensions = sizeOf(ctx.file.path);
      const newPost = await Models.Post.create({
        height: dimensions.height,
        width: dimensions.width,
        source: source,
        url: '/uploads/' + ctx.file.filename,
        thumbUrl: '/uploads/thumbnails/' + ctx.file.filename
      });

      for (var i = 0; i < tags.length; i++) {
        const [tag] = await Models.Tag.findOrCreate({
          where: { name: tags[i] },
          defaults: { active: true }
        });

        await Models.TaggedPost.create({
          postId: newPost.id,
          tagId: tag.id,
          tagName: tag.name
        });
      }

      await sharp(ctx.file.path)
        .resize(200, 200, {
          fit: 'cover'
        })
        .toFile(ctx.file.destination + '/thumbnails/' + ctx.file.filename);

      ctx.body = { status: 'success' };
    } else {
      ctx.throw(errorRes.status, 'Invalid file or tags');
    }
  });

  router.get('/post/search', async ctx => {
    const searchQuery = ctx.query.searchQuery.split(' ').map(x => `'${x}'`);
    const posts = await Models.TaggedPost.findAll({
      attributes: ['postId'],
      group: [
        'TaggedPost.postId',
        'post.id',
        'post->tag.id',
        'post->tag->TaggedPost.postId',
        'post->tag->TaggedPost.tagId',
        'post->tag->TaggedPost.tagName',
        'post->tag->TaggedPost.createdAt',
        'post->tag->TaggedPost.updatedAt'
      ],
      having: Models.sequelize.literal(
        `array_agg("TaggedPost"."tagName") @> array[${searchQuery}]::varchar[]`
      ),
      include: {
        model: Models.Post,
        as: 'post',
        include: {
          model: Models.Tag,
          as: 'tag'
        }
      }
    });

    ctx.body = posts.map(x => x.post);
  });

  router.post('/post/delete', async ctx => {
    const allPosts = await Models.Post.findAll();

    ctx.body = allPosts;
  });
  router.post('/post/addTag', async ctx => {
    const allPosts = await Models.Post.findAll();

    ctx.body = allPosts;
  });
};
