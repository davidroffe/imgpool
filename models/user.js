'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      passwordResetToken: DataTypes.STRING,
      admin: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      bio: {
        type: DataTypes.STRING,
        defaultValue: ''
      },
      sessionId: DataTypes.STRING,
      sessionExpDate: DataTypes.STRING,
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    },
    {}
  );
  return User;
};
