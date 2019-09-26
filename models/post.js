'use strict';
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    'Post',
    {
      status: DataTypes.STRING,
      height: DataTypes.INTEGER,
      width: DataTypes.INTEGER,
      source: DataTypes.STRING,
      url: DataTypes.STRING,
      thumbUrl: DataTypes.STRING
    },
    {}
  );
  Post.associate = function(models) {
    Post.belongsToMany(models.Tag, {
      through: 'TaggedPost',
      as: 'tag',
      foreignKey: 'postId'
    });
  };
  return Post;
};
