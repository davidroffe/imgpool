'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    usernname: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    admin: DataTypes.BOOLEAN,
    bio: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};