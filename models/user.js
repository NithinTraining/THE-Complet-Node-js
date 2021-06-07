'use strict'
module.exports = function (sequelize, DataTypes) {
  const user = sequelize.define(
    'user',
    {
      user_id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull:false
      }
    },
    {
      timestamps: true,
      underscored: true
    }
  )

  user.associate = function (models) {
    user.hasMany(models.rolesUser,{foreignKey:'user_id'})
    user.hasMany(models.fileUser,{foreignKey:'user_id'})
    // user.belongsTo(models.role, { foreignKey: 'role_id' });
  }

  return user;
}
