const tokenHelper = require('../utility/token');
const Models = require('../models');

module.exports = async (ctx, next) => {
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
    } else {
      console.log('No user found with that token; clearing token!');
      console.log('url is: ' + url);
      ctx.cookies.set('auth');
    }
  }
  await next();
};
