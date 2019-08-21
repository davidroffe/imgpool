const jwt = require('jwt-simple');

module.exports = {
  genSecret: function() {
    var j = '';

    for (var i = 0; i < 4; i++) {
      j = (Math.random() * 100000000000000000).toString() + j;
    }

    return j;
  },
  genToken: function() {
    return jwt.encode({ seed: this.genSecret() }, this.genSecret());
  },

  genExpDate: function(minutes = 0) {
    var dateObj = new Date();

    return dateObj.setMinutes(dateObj.getMinutes() + minutes);
  }
};
