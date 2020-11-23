"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (sequelize, DataTypes) {
  var Message = sequelize.define("message", {
    text: DataTypes.STRING,
    url: DataTypes.STRING,
    filetype: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    // timestamps: false,

    indexes: [{
      fields: ["createdAt"]
    }]
  });
  Message.associate = function (models) {
    //1:M
    Message.belongsTo(models.Channel, {
      foreignKey: { name: "channelId", field: "channel_id" }
    });

    Message.belongsTo(models.User, {
      foreignKey: { name: "userId", field: "user_id" }
    });
  };
  return Message;
};