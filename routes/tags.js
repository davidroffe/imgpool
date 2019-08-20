module.exports = (Models, router) => {
  router.get('/tags/get', async ctx => {
    const allTags = await Models.Tag.findAll();

    ctx.body = allTags;
  });
  router.post('/tags/create', async ctx => {
    const allTags = await Models.Tag.findAll();

    ctx.body = allTags;
  });
  router.post('/tags/delete', async ctx => {
    const allTags = await Models.Tag.findAll();

    ctx.body = allTags;
  });
};
