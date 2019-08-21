const bcrypt = require('bcrypt');
const tokenHelper = require('../utility/token');

module.exports = (Models, router) => {
  router.post('/user/signup', async ctx => {
    const email = ctx.query.email || '';
    const password = ctx.query.password || '';

    const emailRegEx = /[\w.]+@[\w.]+/;

    let errorRes = {
      status: 401,
      message: []
    };

    if (!emailRegEx.test(email)) {
      errorRes.message.push('Please enter a valid email.');
    }
    if (password === '') {
      errorRes.message.push('Please enter a password.');
    }
    console.log(errorRes.message[0]);
    if (errorRes.message.length > 0) {
      ctx.throw(401, 'Invalid email or password', errorRes);
    } else {
      const token = tokenHelper.genToken();
      const tokenDate = tokenHelper.genExpDate();
      const user = await Models.User.findOrCreate({
        where: { email: email },
        defaults: {
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(8), null),
          token: token,
          tokenDate: tokenDate
        }
      });
      if (!user[1]) {
        ctx.throw(401, 'Sorry, that email is taken.');
      } else {
        ctx.cookies.set('auth', token);
      }
    }
    ctx.body = ctx.query;
  });
  router.post('/user/login', async ctx => {
    const email = ctx.query.email || '';
    const password = ctx.query.password || '';
    const emailRegEx = /[\w.]+@[\w.]+/;

    if (email === '' || !emailRegEx.test(email) || password === '') {
      ctx.throw(401, 'Invalid email or password');
    } else {
      const user = await Models.User.findOne({ where: { email: email } });
      console.log('user from logging in is set to: ' + user);
      if (!user) {
        ctx.throw(401, 'Invalid email or password');
      } else if (bcrypt.compareSync(password, user.password)) {
        const token = tokenHelper.genToken();
        user.token = token;
        user.tokenDate = tokenHelper.genExpDate();
        user.save();

        ctx.cookies.set('auth', token);
      } else {
        ctx.throw(401, 'Invalid email or password');
      }
    }
  });
  router.post('/tags/delete', async ctx => {
    const allTags = await Models.Tag.findAll();

    ctx.body = allTags;
  });
};
