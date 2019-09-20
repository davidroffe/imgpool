'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      passwordResetToken: DataTypes.STRING,
      admin: DataTypes.BOOLEAN,
      bio: DataTypes.STRING,
      sessionId: DataTypes.STRING,
      sessionExpDate: DataTypes.STRING
    },
    {}
  );
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};
