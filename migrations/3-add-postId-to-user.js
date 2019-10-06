'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Users', 'postId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Posts',
        key: 'id'
      }
    });
  },
  down: queryInterface => {
    queryInterface.removeColumn('Users');
  }
};
