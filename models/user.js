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
      postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Post',
          key: 'id'
        }
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
