"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.channelBatcher = undefined;

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var channelBatcher = exports.channelBatcher = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(ids, models, user) {
    var result, data;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return models.sequelize.query("select distinct on (id) * from channels as c left outer join pcmembers as pc on c.id =pc.channel_id where c.team_id in (:teamIds) and (c.public = true or pc.user_id =:userId)", {
              replacements: { userId: user.id, teamIds: ids },
              model: models.Channel,
              raw: true
            });

          case 2:
            result = _context.sent;
            data = {};

            result.forEach(function (r) {
              if (data[r.team_id]) {
                data[r.team_id].push(r);
              } else {
                data[r.team_id] = [r];
              }
            });
            console.log(data);
            return _context.abrupt("return", ids.map(function (id) {
              return data[id];
            }));

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function channelBatcher(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();