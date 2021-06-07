'use strict'
module.exports = function (sequelize, DataTypes) {
  const permission = sequelize.define(
    'permission',
    {
      permission_id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        type: DataTypes.STRING,
        allowNull : false
      },
      label: {
        type: DataTypes.STRING,
        allowNull : false
      }
    },
  )
  permission.associate = function (models){
    permission.hasMany(models.rolesPermission, { foreignKey: 'permission_id' });
  }
  return permission;
}
