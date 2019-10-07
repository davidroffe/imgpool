const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (Models, router) => {
  router.post('/user/signup', async ctx => {
    const email = ctx.query.email || '';
    const username = ctx.query.username || '';
    const password = ctx.query.password || '';
    const passwordConfirm = ctx.query.passwordConfirm || '';
    const secret = process.env.JWT_SECRET;
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
      const user = await Models.User.findOrCreate({
        where: { email: email },
        defaults: {
          username: username,
          admin: false,
          active: true,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
        }
      });
      if (!user[1]) {
        ctx.throw(401, 'Sorry, that email is taken.');
      } else {
        const payload = { id: user[0].id };
        const options = { expiresIn: '1h' };
        const sessionToken = jwt.sign(payload, secret, options);

        user[0].sessionToken = bcrypt.hashSync(
          sessionToken,
          bcrypt.genSaltSync(8),
          null
        );
        user[0].save();

        ctx.cookies.set('auth', sessionToken, { httpOnly: false });
        ctx.status = 200;
        ctx.body = {
          username: user[0].username,
          email: user[0].email,
          admin: user[0].admin
        };
      }
    }
  });
  router.post('/user/login', async ctx => {
    const email = ctx.query.email || '';
    const password = ctx.query.password || '';
    const emailRegEx = /[\w.]+@[\w.]+/;
    const secret = process.env.JWT_SECRET;

    if (email === '' || !emailRegEx.test(email) || password === '') {
      ctx.throw(401, 'Invalid email or password');
    } else {
      const user = await Models.User.findOne({ where: { email: email } });
      if (!user) {
        ctx.throw(401, 'Invalid email or password');
      } else if (bcrypt.compareSync(password, user.password)) {
        const payload = { id: user.id };
        const options = { expiresIn: '1h' };
        const sessionToken = jwt.sign(payload, secret, options);

        user.sessionToken = bcrypt.hashSync(
          sessionToken,
          bcrypt.genSaltSync(8),
          null
        );
        user.save();

        ctx.cookies.set('auth', sessionToken, { httpOnly: false });
        ctx.status = 200;
        ctx.body = {
          username: user.username,
          email: user.email,
          admin: user.admin
        };
      } else {
        ctx.throw(401, 'Invalid email or password');
      }
    }
  });
  router.post('/user/logout', async ctx => {
    const sessionToken = ctx.cookies.get('auth');
    const secret = process.env.JWT_SECRET;
    const payload = jwt.verify(sessionToken, secret);

    if (payload) {
      const user = await Models.User.findOne({
        where: { id: payload.id }
      });
      if (bcrypt.compareSync(sessionToken, user.sessionToken)) {
        ctx.cookies.set('auth');
        user.sessionToken = '';
        user.save();
      }
    }
    ctx.status = 200;
  });
  router.post('/user/edit', async ctx => {
    const sessionToken = ctx.cookies.get('auth');
    const secret = process.env.JWT_SECRET;
    const payload = jwt.verify(sessionToken, secret);
    const field = ctx.query.editField;
    const email = ctx.query.email || '';
    const username = ctx.query.username || '';
    const bio = ctx.query.bio || '';
    const password = ctx.query.password || '';
    const passwordConfirm = ctx.query.passwordConfirm || '';
    const emailRegEx = /[\w.]+@[\w.]+/;

    if (payload) {
      const user = await Models.User.findOne({ where: { id: payload.id } });
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
        } else if (field === 'edit-bio') {
          if (typeof bio === undefined) {
            ctx.throw(401, 'Invalid bio');
          } else {
            user.bio = bio;
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
        user.save();
        ctx.status = 200;
        ctx.body = {
          status: 'success',
          username: user.username,
          email: user.email,
          bio: user.bio
        };
      }
    } else {
      ctx.throw(401, 'Invalid session');
    }
  });
  router.post('/user/delete/self', async ctx => {
    const sessionToken = ctx.cookies.get('auth');
    const secret = process.env.JWT_SECRET;
    const password = ctx.query.password || '';
    const payload = jwt.verify(sessionToken, secret);

    if (payload) {
      const user = await Models.User.findOne({ where: { id: payload.id } });
      if (!user || !bcrypt.compareSync(sessionToken, user.sessionToken)) {
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
    } else {
      ctx.throw(401, 'Invalid session');
    }
  });
  router.post('/user/validate', async ctx => {
    const sessionToken = ctx.cookies.get('auth');
    const secret = process.env.JWT_SECRET;

    if (sessionToken) {
      try {
        const payload = jwt.verify(sessionToken, secret);
        if (payload) {
          const user = await Models.User.findOne({ where: { id: payload.id } });

          console.log(
            'Checking DB for user with session token: ' + sessionToken
          );
          if (user && bcrypt.compareSync(sessionToken, user.sessionToken)) {
            console.log('User with that session ID found in DB...');
            //Check for expiration
            const payload = { id: user.id };
            const options = { expiresIn: '1h' };
            const sessionToken = jwt.sign(payload, secret, options);

            user.sessionToken = bcrypt.hashSync(
              sessionToken,
              bcrypt.genSaltSync(8),
              null
            );
            user.save();

            ctx.cookies.set('auth', sessionToken, { httpOnly: false });

            ctx.body = {
              username: user.username,
              email: user.email,
              bio: user.bio,
              admin: user.admin,
              valid: true
            };
          }
        }
      } catch (error) {
        ctx.body = {
          username: '',
          email: '',
          admin: false,
          valid: false
        };
        ctx.cookies.set('auth');
      }
    }
    ctx.status = 200;
  });
  router.get('/user/get', async ctx => {
    const sessionToken = ctx.cookies.get('auth') || '';
    const secret = process.env.JWT_SECRET;
    const payload = jwt.verify(sessionToken, secret);

    if (payload) {
      const user = await Models.User.findOne({
        where: { id: payload.id }
      });

      if (
        user &&
        bcrypt.compareSync(sessionToken, user.sessionToken) &&
        user.admin
      ) {
        const users = await Models.User.findAll({
          attributes: ['id', 'username']
        });
        ctx.body = users;
      } else {
        ctx.throw(401, 'Unauthorized request.');
      }
    } else {
      ctx.throw(401, 'Invalid session');
    }
    ctx.status = 200;
  });
  router.get('/user/get/:id', async ctx => {
    const userId = ctx.params.id;
    if (userId) {
      const user = await Models.User.findOne({
        where: { id: userId },
        attributes: ['username', 'bio', ['createdAt', 'joinDate']],
        include: {
          model: Models.Post,
          as: 'post'
        }
      });
      if (user) {
        ctx.body = {
          ...user.dataValues,
          valid: true
        };
      } else {
        ctx.body = {
          username: '',
          email: '',
          valid: false
        };
      }
    } else {
      ctx.body = {
        username: '',
        email: '',
        valid: false
      };
    }
    ctx.status = 200;
  });
  router.post('/user/password-reset/', async ctx => {
    const email = ctx.query.email || '';
    const password = ctx.query.password || '';
    const passwordResetToken = ctx.query.passwordResetToken;
    const secret = process.env.JWT_SECRET;

    if (passwordResetToken) {
      try {
        const payload = jwt.verify(passwordResetToken, secret);

        if (payload) {
          const user = await Models.User.findOne({
            where: { email: payload.email }
          });

          if (
            user &&
            bcrypt.compareSync(passwordResetToken, user.passwordResetToken)
          ) {
            if (password.length < 8) {
              ctx.throw(401, 'Invalid password length.');
            } else {
              user.password = bcrypt.hashSync(
                password,
                bcrypt.genSaltSync(12),
                null
              );

              const payload = { id: user.id };
              const options = { expiresIn: '1h' };
              const sessionToken = jwt.sign(payload, secret, options);

              user.sessionToken = bcrypt.hashSync(
                sessionToken,
                bcrypt.genSaltSync(8),
                null
              );
              user.save();

              ctx.cookies.set('auth', sessionToken, { httpOnly: false });
              ctx.status = 200;
              ctx.body = {
                username: user.username,
                email: user.email
              };
            }
          } else {
            ctx.throw(401, 'Invalid Token.');
          }
        }
      } catch (e) {
        ctx.throw(401, e.message);
      }
    } else {
      const user = await Models.User.findOne({
        where: { email }
      });

      if (user) {
        const payload = { email };
        const options = { expiresIn: '1h' };
        const token = jwt.sign(payload, secret, options);

        user.passwordResetToken = bcrypt.hashSync(
          token,
          bcrypt.genSaltSync(8),
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
          html: `<div style="width: 825px;max-width: 100%;"><h1 style="margin:0 auto 35px;color:#333;font-size:55px;font-family: sans-serif;font-weight: 600;"><span style="padding-right:15px;border-right:1px solid #333;">Password Reset</span></h1><p style="margin:10px 0;color:#333;font-weight: 600;font-size: 14px;line-height: 20px;">If you requested a password reset for ${user.username}, click the button below. If you didn't make this request, ignore this email.</p><a href="https://imgpool.app/password-reset/${token}" style="display:block; margin-top:50px;border:2px solid #333;padding:15px 14px 20px;box-sizing:border-box;width:326px;height:50px;background:none;text-align:center;text-transform:uppercase;text-decoration:none;color:#333;font-family:sans-serif;font-size:12px;font-weight:600;display:block;cursor:pointer;outline:none;">Reset Password</a>
          </div>`
        });
      }
    }
  });
};
