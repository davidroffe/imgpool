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
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    },
    {}
  );
  User.associate = function(models) {
    User.hasMany(models.Post, {
      as: 'post',
      foreignKey: 'userId'
    });
  };
  return User;
};
