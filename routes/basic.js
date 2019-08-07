module.exports = router => {
  router.get('/hello', ctx => {
    ctx.body = 'Hello World!';
  });
};
