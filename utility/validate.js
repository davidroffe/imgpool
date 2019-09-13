const sessionHelper = require('../utility/session');
const Models = require('../models');

module.exports = async (ctx, next) => {
  const sessionId = ctx.cookies.get('auth');
  const url = ctx.url;

  if (sessionId) {
    const user = await Models.User.findOne({ where: { sessionId: sessionId } });

    console.log('Checking DB for user with session ID: ' + sessionId);
    if (user) {
      console.log('User with that session ID found in DB...');
      //Check for expiration
      if (user.sessionExpDate <= Date.now()) {
        console.log('Session has expired, clearing session!');
        ctx.cookies.set('auth');
        user.sessionId = '';
        user.sessionExpDate = '';
        user.save();
      } else {
        user.sessionExpDate = sessionHelper.genExpDate();
        user.save();
      }
    } else {
      console.log('No user found with that session ID; clearing session!');
      console.log('url is: ' + url);
      ctx.cookies.set('auth');
    }
  }
  await next();
};
