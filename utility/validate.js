const jwt = require('jsonwebtoken');

module.exports = async (ctx, next) => {
  const sessionToken = ctx.cookies.get('auth');
  const secret = process.env.JWT_SECRET;

  if (sessionToken) {
    try {
      const payload = jwt.verify(sessionToken, secret);
      if (payload) {
        const payload = { id: payload.id, admin: payload.admin };
        const options = { expiresIn: '1h' };
        const sessionToken = jwt.sign(payload, secret, options);

        ctx.cookies.set('auth', sessionToken, { httpOnly: true });
      }
    } catch (error) {
      ctx.cookies.set('auth');
    }
  }
  await next();
};
