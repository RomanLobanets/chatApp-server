'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _sequelize = require('sequelize');

var _sequelize2 = _interopRequireDefault(_sequelize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// const sequelize = new Sequelize("slack", "avnadmin", "jhek8h30m7lf24y7", {
//   dialect: "postgres",
// });
var sequelize = new _sequelize2.default('postgres://avnadmin:saizszmufvlzuvw0@pg-266e3494-extreme-cb0c.aivencloud.com:26522/defaultdb?sslmode=require', {
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false
    },
    host: process.env.DB_HOST || 'localhost'
  },
  define: { undescored: true }
});

var models = {
  User: sequelize.import('./users'),
  Channel: sequelize.import('./channel'),
  Message: sequelize.import('./message'),
  Team: sequelize.import('./team'),
  Member: sequelize.import('./member'),
  PCMember: sequelize.import('./pcmember')
};
(0, _keys2.default)(models).forEach(function (modelName) {
  if ('associate' in models[modelName]) {
    models[modelName].associate(models);
  }
});
models.sequelize = sequelize;
models.Sequelize = _sequelize2.default;
models.op = _sequelize2.default.Op;

exports.default = models;