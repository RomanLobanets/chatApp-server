'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var formatErrors = function formatErrors(error, models) {
  if (error instanceof models.Sequelize.ValidationError) {
    return error.errors.map(function (x) {
      return _lodash2.default.pick(x, ['path', 'message']);
    });
  }
  return [{ path: 'name', message: 'something went wrong' }];
};

exports.default = formatErrors;
