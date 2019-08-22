const bcrypt = require('bcrypt');
const tokenHelper = require('../utility/token');

module.exports = (Models, router) => {
  router.post('/user/signup', async ctx => {
    const email = ctx.query.email || '';
    const username = ctx.query.username || '';
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
          username: username,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(8), null),
          token: token,
          tokenDate: tokenDate
        }
      });
      if (!user[1]) {
        ctx.throw(401, 'Sorry, that email is taken.');
      } else {
        ctx.cookies.set('auth', token, { httpOnly: false });
        ctx.status = 200;
        ctx.body = {
          username: user.username,
          email: user.email
        };
      }
    }
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

        ctx.cookies.set('auth', token, { httpOnly: false });
        ctx.status = 200;
        ctx.body = {
          username: user.username,
          email: user.email
        };
      } else {
        ctx.throw(401, 'Invalid email or password');
      }
    }
  });
  router.post('/user/validate', async ctx => {
    const token = ctx.cookies.get('auth');
    const url = ctx.url;

    if (token) {
      const user = await Models.User.findOne({ where: { token: token } });

      console.log('Checking DB for user with token: ' + token);
      if (user) {
        console.log('User with token found in DB...');
        //Check for expiration
        if (user.tokenDate <= Date.now()) {
          console.log('Token has expired, clearing token!');
          ctx.cookies.set('auth');
          user.token = '';
          user.tokenDate = '';
          user.save();
        } else {
          user.tokenDate = tokenHelper.genExpDate();
          user.save();
        }
        ctx.body = {
          username: user.username,
          email: user.email
        };
      } else {
        console.log('No user found with that token; clearing token!');
        console.log('url is: ' + url);
        ctx.cookies.set('auth');
      }
    }
    ctx.status = 200;
  });
  router.post('/user/delete', async ctx => {
    const allTags = await Models.Tag.findAll();

    ctx.body = allTags;
  });
};
