const Models = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

module.exports = async (ctx, next) => {
  const sessionToken = ctx.cookies.get('auth');
  const secret = process.env.JWT_SECRET;

  if (sessionToken) {
    try {
      const payload = jwt.verify(sessionToken, secret);
      if (payload) {
        const user = await Models.User.findOne({ where: { id: payload.id } });

        console.log('Checking DB for user with session token: ' + sessionToken);
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
        }
      }
    } catch (error) {
      ctx.cookies.set('auth');
    }
  }
  await next();
};
