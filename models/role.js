'use strict'
module.exports = function (sequelize, DataTypes) {
  const role = sequelize.define(
    'role',
    {
      role_id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
  )
  role.associate = function (models) {
    role.hasMany(models.rolesUser, { foreignKey: 'role_id' });
    role.hasMany(models.rolesPermission, { foreignKey: 'role_id' });
  }
  return role;
}
