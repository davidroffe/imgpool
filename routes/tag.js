module.exports = (Models, router) => {
  router.get('/tag/get', async ctx => {
    const allTags = await Models.Tag.findAll();

    ctx.body = allTags;
  });
  router.post('/tag/create', async ctx => {
    const allTags = await Models.Tag.findAll();

    ctx.body = allTags;
  });
  router.post('/tag/delete', async ctx => {
    const allTags = await Models.Tag.findAll();

    ctx.body = allTags;
  });
};
