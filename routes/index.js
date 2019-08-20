const Models = require('../models');

module.exports = router => {
  require('./posts')(Models, router);
  require('./tags')(Models, router);
  require('./users')(Models, router);
};
