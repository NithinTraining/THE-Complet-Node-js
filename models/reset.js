'use strict'

//const { DATE } = require("sequelize/types");

module.exports = function (sequelize, DataTypes) {
  const ResetTokens = sequelize.define(
    'ResetTokens',
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false
      },
      expiration: {
        type: DataTypes.DATE,

      },
      used:{
          type:DataTypes.INTEGER,
    
          default:0
      }
    },
    {
      timestamps: true,
      underscored: true
    }
  )

  
  

  return ResetTokens;
}
