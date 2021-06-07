'use strict'
module.exports = function (sequelize, DataTypes) {
  const rolesUser = sequelize.define(
    'rolesUser',
    
  )
  rolesUser.associate=function(models){
    rolesUser.belongsTo(models.user,{ foreignKey: 'user_id' }) 
    rolesUser.belongsTo(models.role,{foreignKey:'role_id'})
  }

  return rolesUser;
}
