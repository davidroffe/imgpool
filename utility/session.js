const crypto = require('crypto');

module.exports = {
  genHash: function() {
    return crypto.randomBytes(20).toString('hex');
  },
  genExpDate: function(minutes = 60) {
    var dateObj = new Date();

    return dateObj.setMinutes(dateObj.getMinutes() + minutes);
  }
};
