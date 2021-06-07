'use strict'
module.exports = function (sequelize, DataTypes) {
  const fileUser = sequelize.define(
    'fileUser',
  
  )
  fileUser.associate=function(models){
    fileUser.belongsTo(models.user,{ foreignKey: 'user_id' }) 
    fileUser.belongsTo(models.file,{foreignKey:'file_id'})
  }

  return fileUser;
}
