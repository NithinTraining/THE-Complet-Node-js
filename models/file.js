'use strict'
module.exports = function (sequelize, DataTypes) {
  const file = sequelize.define(
    'file',
    {
      file_id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },

      image_name: {
        type: DataTypes.STRING,
        allownull: false
      },
      image: {
        type: DataTypes.STRING,
        allownull: false
      }
    },

    {
      timestamps: true,
      underscored: true
    }
  )

  file.associate = function (models) {
    file.hasMany(models.fileUser, { foreignKey: 'file_id' })
    // user.belongsTo(models.role, { foreignKey: 'role_id' });
  }

  return file;
}
