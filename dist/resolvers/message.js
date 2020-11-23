"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require("babel-runtime/helpers/objectWithoutProperties");

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _defineProperty2 = require("babel-runtime/helpers/defineProperty");

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _permission = require("../permission");

var _graphqlSubscriptions = require("graphql-subscriptions");

var _pubsub = require("../pubsub");

var _pubsub2 = _interopRequireDefault(_pubsub);

var _graphql = require("graphql");

var _language = require("graphql/language");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NEW_CHANNEL_MESSAGE = "NEW_CHANNEL_MESSAGE";

exports.default = {
  Date: new _graphql.GraphQLScalarType({
    name: "Date",
    description: "Date custom scalar type",
    parseValue: function parseValue(value) {
      console.log("----------------------------1", new Date(value));
      return new Date(value); // value from the client
    },
    serialize: function serialize(value) {
      console.log("----------------------------2", value, new Date(value));
      return value; // .getTime(); // value sent to the client
    },
    parseLiteral: function parseLiteral(ast) {
      console.log("----------------------------3");
      if (ast.kind === _language.Kind.INT) {
        return parseInt(ast.value, 10); // ast value is always in string format
      }
      return null;
    }
  }),

  Subscription: {
    newChannelMessage: {
      subscribe: _permission.requiresTeamAccess.createResolver((0, _graphqlSubscriptions.withFilter)(function (parent, _ref, _ref2) {
        var channelId = _ref.channelId;
        var models = _ref2.models,
            user = _ref2.user;
        return _pubsub2.default.asyncIterator(NEW_CHANNEL_MESSAGE);
      }, function (payload, args) {
        return payload.channelId === args.channelId;
      }))
    }
  },
  Message: {
    url: function url(parent, args, _ref3) {
      var serverUrl = _ref3.serverUrl;
      return parent.url ? serverUrl + "/" + parent.url : parent.url;
    },
    user: function () {
      var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(_ref5, args, _ref6) {
        var _user = _ref5.user,
            userId = _ref5.userId;
        var models = _ref6.models;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!_user) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt("return", _user);

              case 2:
                _context.next = 4;
                return models.User.findOne({ where: { id: userId } });

              case 4:
                return _context.abrupt("return", _context.sent);

              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, undefined);
      }));

      return function user(_x, _x2, _x3) {
        return _ref4.apply(this, arguments);
      };
    }()
  },
  Query: {
    messages: _permission.requiersAuth.createResolver(function () {
      var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(parent, _ref8, _ref9) {
        var channelId = _ref8.channelId,
            cursor = _ref8.cursor;
        var models = _ref9.models,
            user = _ref9.user;
        var channel, member, options, messages;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return models.Channel.findOne({
                  raw: true,
                  where: { id: channelId }
                });

              case 2:
                channel = _context2.sent;

                if (channel.public) {
                  _context2.next = 9;
                  break;
                }

                _context2.next = 6;
                return models.PCMember.findOne({
                  raw: true,
                  where: { channelId: channelId, userId: user.id }
                });

              case 6:
                member = _context2.sent;

                if (member) {
                  _context2.next = 9;
                  break;
                }

                throw new Error("Not Authorized");

              case 9:
                options = {
                  where: { channelId: channelId },
                  order: [["createdAt", "DESC"]],
                  limit: 10
                };


                if (cursor) {
                  options.where.createdAt = (0, _defineProperty3.default)({}, models.op.lt, cursor);
                }
                _context2.next = 13;
                return models.Message.findAll(options, { raw: true });

              case 13:
                messages = _context2.sent;
                return _context2.abrupt("return", messages);

              case 15:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, undefined);
      }));

      return function (_x4, _x5, _x6) {
        return _ref7.apply(this, arguments);
      };
    }())
  },
  Mutation: {
    createMessage: _permission.requiersAuth.createResolver(function () {
      var _ref10 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(parent, _ref11, _ref12) {
        var file = _ref11.file,
            args = (0, _objectWithoutProperties3.default)(_ref11, ["file"]);
        var models = _ref12.models,
            user = _ref12.user;
        var messageData, message, currentUser;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                messageData = args;


                if (file) {
                  messageData.filetype = file.type;
                  messageData.url = file.path;
                }
                _context3.next = 5;
                return models.Message.create((0, _extends3.default)({}, messageData, {
                  userId: user.id
                }));

              case 5:
                message = _context3.sent;
                _context3.next = 8;
                return models.User.findOne({
                  where: { id: user.id }
                });

              case 8:
                currentUser = _context3.sent;


                _pubsub2.default.publish(NEW_CHANNEL_MESSAGE, {
                  channelId: args.channelId,
                  newChannelMessage: (0, _extends3.default)({}, message.dataValues, {
                    user: currentUser.dataValues
                  })
                });

                return _context3.abrupt("return", true);

              case 13:
                _context3.prev = 13;
                _context3.t0 = _context3["catch"](0);

                console.log(_context3.t0);
                return _context3.abrupt("return", false);

              case 17:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, undefined, [[0, 13]]);
      }));

      return function (_x7, _x8, _x9) {
        return _ref10.apply(this, arguments);
      };
    }())
  }
};