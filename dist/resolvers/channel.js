"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _defineProperty2 = require("babel-runtime/helpers/defineProperty");

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _slicedToArray2 = require("babel-runtime/helpers/slicedToArray");

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _toConsumableArray2 = require("babel-runtime/helpers/toConsumableArray");

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _formatErrors = require("../helpers/formatErrors");

var _formatErrors2 = _interopRequireDefault(_formatErrors);

var _permission = require("../permission");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  Mutation: {
    getOrCreateChannel: _permission.requiersAuth.createResolver(function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(parent, _ref2, _ref3) {
        var teamId = _ref2.teamId,
            members = _ref2.members;
        var models = _ref3.models,
            user = _ref3.user;

        var member, AllMembers, _ref4, _ref5, data, result, users, name, channelId;

        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return models.Member.findOne({
                  where: { teamId: teamId, userId: user.id }
                }, { raw: true });

              case 2:
                member = _context2.sent;

                if (member) {
                  _context2.next = 5;
                  break;
                }

                throw new Error("not a part of team");

              case 5:
                AllMembers = [].concat((0, _toConsumableArray3.default)(members), [user.id]);
                _context2.next = 8;
                return models.sequelize.query(" select c.id, c.name from channels as c, \n          pcmembers pc where pc.channel_id=c.id and c.dm=true and\n           c.public=false and c.team_id=" + teamId + " group by c.id, c.name having array_agg(pc.user_id)\n            @> Array[" + AllMembers.join(",") + "] and count(pc.user_id)=" + AllMembers.length, { raw: true });

              case 8:
                _ref4 = _context2.sent;
                _ref5 = (0, _slicedToArray3.default)(_ref4, 2);
                data = _ref5[0];
                result = _ref5[1];

                if (!data.length) {
                  _context2.next = 14;
                  break;
                }

                return _context2.abrupt("return", data[0]);

              case 14:
                _context2.next = 16;
                return models.User.findAll({
                  raw: true,
                  where: {
                    id: (0, _defineProperty3.default)({}, models.Sequelize.Op.in, members)
                  }
                });

              case 16:
                users = _context2.sent;
                name = users.map(function (u) {
                  return u.username;
                }).join(", ");
                _context2.next = 20;
                return models.sequelize.transaction(function () {
                  var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(transaction) {
                    var channel, cId, pcmembers;
                    return _regenerator2.default.wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            _context.next = 2;
                            return models.Channel.create({ name: name, public: false, dm: true, teamId: teamId }, {
                              transaction: transaction
                            });

                          case 2:
                            channel = _context.sent;
                            cId = channel.dataValues.id;
                            pcmembers = AllMembers.map(function (m) {
                              return {
                                userId: m,
                                channelId: cId
                              };
                            });

                            console.log("pc mem", pcmembers);
                            _context.next = 8;
                            return models.PCMember.bulkCreate(pcmembers, { transaction: transaction });

                          case 8:
                            return _context.abrupt("return", cId);

                          case 9:
                          case "end":
                            return _context.stop();
                        }
                      }
                    }, _callee, undefined);
                  }));

                  return function (_x4) {
                    return _ref6.apply(this, arguments);
                  };
                }());

              case 20:
                channelId = _context2.sent;
                return _context2.abrupt("return", {
                  id: channelId,
                  name: name
                });

              case 22:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, undefined);
      }));

      return function (_x, _x2, _x3) {
        return _ref.apply(this, arguments);
      };
    }()),
    createChannel: _permission.requiersAuth.createResolver(function () {
      var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(parent, args, _ref8) {
        var models = _ref8.models,
            user = _ref8.user;
        var member, responce;
        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.prev = 0;
                _context4.next = 3;
                return models.Member.findOne({
                  where: { teamId: args.teamId, userId: user.id }
                }, { raw: true });

              case 3:
                member = _context4.sent;

                if (member.admin) {
                  _context4.next = 6;
                  break;
                }

                return _context4.abrupt("return", {
                  ok: false,
                  errors: [{
                    path: "name",
                    message: "You have to be the owner of the team to create channel"
                  }]
                });

              case 6:
                _context4.next = 8;
                return models.sequelize.transaction(function () {
                  var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(transaction) {
                    var channel, members, pcmembers;
                    return _regenerator2.default.wrap(function _callee3$(_context3) {
                      while (1) {
                        switch (_context3.prev = _context3.next) {
                          case 0:
                            _context3.next = 2;
                            return models.Channel.create(args, {
                              transaction: transaction
                            });

                          case 2:
                            channel = _context3.sent;

                            if (args.public) {
                              _context3.next = 9;
                              break;
                            }

                            members = args.members.filter(function (m) {
                              return m !== user.id;
                            });

                            members.push(user.id);
                            pcmembers = args.members.map(function (m) {
                              return {
                                userId: m,
                                channelId: channel.dataValues.id
                              };
                            });
                            _context3.next = 9;
                            return models.PCMember.bulkCreate(pcmembers, { transaction: transaction });

                          case 9:
                            return _context3.abrupt("return", channel);

                          case 10:
                          case "end":
                            return _context3.stop();
                        }
                      }
                    }, _callee3, undefined);
                  }));

                  return function (_x8) {
                    return _ref9.apply(this, arguments);
                  };
                }());

              case 8:
                responce = _context4.sent;
                return _context4.abrupt("return", {
                  ok: true,
                  channel: responce
                });

              case 12:
                _context4.prev = 12;
                _context4.t0 = _context4["catch"](0);

                console.log(_context4.t0);
                return _context4.abrupt("return", {
                  ok: false,
                  errors: (0, _formatErrors2.default)(_context4.t0, models)
                });

              case 16:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, undefined, [[0, 12]]);
      }));

      return function (_x5, _x6, _x7) {
        return _ref7.apply(this, arguments);
      };
    }())
  }
};