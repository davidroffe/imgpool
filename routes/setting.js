module.exports = (Models, router) => {
  router.get('/setting/signup', async ctx => {
    const settings = await Models.Setting.findOne({
      attributes: ['signUp']
    });

    ctx.body = { signUp: settings.signUp };
  });
};
