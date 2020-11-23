"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _formatErrors = require("../helpers/formatErrors");

var _formatErrors2 = _interopRequireDefault(_formatErrors);

var _auth = require("../auth");

var _permission = require("../permission");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  User: {
    teams: function teams(parent, args, _ref) {
      var models = _ref.models,
          user = _ref.user;
      return models.sequelize.query("select * from teams as team join members as member on team.id = member.team_id  where member.user_id = ?", {
        replacements: [user.id],
        model: models.Team,
        raw: true
      });
    }
  },
  Query: {
    allUsers: function allUsers(parent, args, _ref2) {
      var models = _ref2.models;
      return models.User.findAll();
    },
    getUser: function getUser(parent, _ref3, _ref4) {
      var userId = _ref3.userId;
      var models = _ref4.models;
      return models.User.findOne({ where: { id: userId } });
    },
    // add skip and limit

    me: _permission.requiersAuth.createResolver(function (parent, args, _ref5) {
      var models = _ref5.models,
          user = _ref5.user;
      return models.User.findOne({ where: { id: user.id } });
    })
  },
  Mutation: {
    login: function login(parent, _ref6, _ref7) {
      var email = _ref6.email,
          password = _ref6.password;
      var models = _ref7.models,
          SECRET = _ref7.SECRET,
          SECRET2 = _ref7.SECRET2;
      return (0, _auth.tryLogin)(email, password, models, SECRET, SECRET2);
    },

    register: function () {
      var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(parent, args, _ref9) {
        var models = _ref9.models;
        var user;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return models.User.create(args);

              case 3:
                user = _context.sent;
                return _context.abrupt("return", {
                  ok: true,
                  user: user,
                  errors: null
                });

              case 7:
                _context.prev = 7;
                _context.t0 = _context["catch"](0);

                console.log(_context.t0);
                return _context.abrupt("return", {
                  ok: false,
                  user: null,
                  errors: (0, _formatErrors2.default)(_context.t0, models)
                });

              case 11:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, undefined, [[0, 7]]);
      }));

      return function register(_x, _x2, _x3) {
        return _ref8.apply(this, arguments);
      };
    }()
  }
};