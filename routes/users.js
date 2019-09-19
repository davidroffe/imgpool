const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const auth = require('../utility/auth');
require('dotenv').config();

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
      const sessionId = auth.genHash();
      const sessionExpDate = auth.genExpDate();
      const user = await Models.User.findOrCreate({
        where: { email: email },
        defaults: {
          username: username,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(8), null),
          sessionId: sessionId,
          sessionExpDate: sessionExpDate
        }
      });
      if (!user[1]) {
        ctx.throw(401, 'Sorry, that email is taken.');
      } else {
        ctx.cookies.set('auth', sessionId, { httpOnly: false });
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
        const sessionId = auth.genHash();
        user.sessionId = sessionId;
        user.sessionExpDate = auth.genExpDate();
        user.save();

        ctx.cookies.set('auth', sessionId, { httpOnly: false });
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
  router.post('/user/logout', async ctx => {
    const sessionId = ctx.cookies.get('auth');

    if (sessionId) {
      const user = await Models.User.findOne({
        where: { sessionId: sessionId }
      });

      ctx.cookies.set('auth');
      user.sessionId = '';
      user.sessionExpDate = '';
      user.save();
    }
    ctx.status = 200;
  });
  router.post('/user/edit', async ctx => {
    const sessionId = ctx.cookies.get('auth');
    const field = ctx.query.editField;
    const email = ctx.query.email || '';
    const username = ctx.query.username || '';
    const password = ctx.query.password || '';
    const passwordConfirm = ctx.query.passwordConfirm || '';
    const emailRegEx = /[\w.]+@[\w.]+/;

    const user = await Models.User.findOne({ where: { sessionId: sessionId } });
    if (!user) {
      ctx.throw(401, 'Invalid session');
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
      user.sessionExpDate = auth.genExpDate();
      user.save();
      ctx.status = 200;
      ctx.body = {
        status: 'success',
        username: user.username,
        email: user.email
      };
    }
  });
  router.post('/user/delete', async ctx => {
    const sessionId = ctx.cookies.get('auth');
    const password = ctx.query.password || '';
    const user = await Models.User.findOne({ where: { sessionId: sessionId } });
    if (!user) {
      ctx.throw(401, 'Invalid session');
    } else {
      if (password === '' || !bcrypt.compareSync(password, user.password)) {
        ctx.throw(401, 'Invalid password');
      } else {
        user.destroy();
        ctx.cookies.set('auth');
        ctx.status = 200;
      }
    }
  });
  router.post('/user/validate', async ctx => {
    const sessionId = ctx.cookies.get('auth');

    if (sessionId) {
      const user = await Models.User.findOne({
        where: { sessionId: sessionId }
      });

      if (user) {
        //Check for expiration
        if (user.sessionExpDate <= Date.now()) {
          ctx.cookies.set('auth');
          user.sessionId = '';
          user.sessionExpDate = '';
          user.save();
          ctx.body = {
            username: '',
            email: '',
            valid: false
          };
        } else {
          user.sessionExpDate = auth.genExpDate();
          user.save();

          ctx.body = {
            username: user.username,
            email: user.email,
            valid: true
          };
        }
      } else {
        ctx.body = {
          username: '',
          email: '',
          valid: false
        };
        ctx.cookies.set('auth');
      }
    }
    ctx.status = 200;
  });
  router.post('/user/password-reset', async ctx => {
    const email = ctx.query.email || '';

    const user = await Models.User.findOne({
      where: { email: email }
    });

    if (user) {
      const newPassword = auth.genPassword();

      user.password = bcrypt.hashSync(
        newPassword,
        bcrypt.genSaltSync(12),
        null
      );
      user.save();
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD
        }
      });

      transporter.sendMail({
        from: '"Imgpool Support" <support@imgpool.app>', // sender address
        to: user.email,
        subject: 'Password Reset', // Subject line
        text: `Random password: ${newPassword}` // plain text body
      });
    }
  });
};
