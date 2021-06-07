'use strict'
module.exports = function (sequelize, DataTypes) {
  const rolesPermission = sequelize.define(
    'rolesPermission',
    
  )
  rolesPermission.associate=function(models){
    rolesPermission.belongsTo(models.permission,{ foreignKey: 'permission_id' }) 
    rolesPermission.belongsTo(models.role,{foreignKey:'role_id'})
  }

  return rolesPermission;
}
