const bcrypt = require('bcrypt');
const tokenHelper = require('../utility/token');

module.exports = (Models, router) => {
  router.post('/user/signup', async ctx => {
    const email = ctx.query.email || '';
    const username = ctx.query.username || '';
    const password = ctx.query.password || '';
    const passwordConfirm = ctx.query.passwordConfirm || '';

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
    if (password !== passwordConfirm) {
      errorRes.message.push('Please enter a matching password confirmation.');
    }
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
          username: user[0].username,
          email: user[0].email
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
  router.post('/user/edit', async ctx => {
    const token = ctx.cookies.get('auth');
    const field = ctx.query.editField;
    const email = ctx.query.email || '';
    const username = ctx.query.username || '';
    const password = ctx.query.password || '';
    const passwordConfirm = ctx.query.passwordConfirm || '';
    const emailRegEx = /[\w.]+@[\w.]+/;

    const user = await Models.User.findOne({ where: { token: token } });
    if (!user) {
      ctx.throw(401, 'Invalid token');
    } else {
      if (field === 'edit-email') {
        if (email === '' || !emailRegEx.test(email)) {
          ctx.throw(401, 'Invalid email');
        } else {
          user.email = email;
        }
      } else if (field === 'edit-username') {
        if (username === '') {
          ctx.throw(401, 'Invalid username');
        } else {
          user.username = username;
        }
      } else if (field === 'edit-password') {
        if (
          password === '' ||
          passwordConfirm === '' ||
          password !== passwordConfirm
        ) {
          ctx.throw(401, 'Invalid password');
        } else {
          user.password = bcrypt.hashSync(
            password,
            bcrypt.genSaltSync(12),
            null
          );
        }
      }
      user.tokenDate = tokenHelper.genExpDate();
      user.save();
      ctx.status = 200;
      ctx.body = {
        status: 'success',
        username: user.username,
        email: user.email
      };
    }
  });
  router.post('/user/validate', async ctx => {
    const token = ctx.cookies.get('auth');

    if (token) {
      const user = await Models.User.findOne({ where: { token: token } });

      if (user) {
        //Check for expiration
        if (user.tokenDate <= Date.now()) {
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
