"use strict";

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require("body-parser");

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _http = require("http");

var _graphql = require("graphql");

var _subscriptionsTransportWs = require("subscriptions-transport-ws");

var _expressGraphql = require("express-graphql");

var _apolloServerExpress = require("apollo-server-express");

var _graphqlTools = require("graphql-tools");

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _mergeGraphqlSchemas = require("merge-graphql-schemas");

var _cors = require("cors");

var _cors2 = _interopRequireDefault(_cors);

var _jsonwebtoken = require("jsonwebtoken");

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _auth = require("./auth");

var _formidable = require("formidable");

var _formidable2 = _interopRequireDefault(_formidable);

var _dataloader = require("dataloader");

var _dataloader2 = _interopRequireDefault(_dataloader);

var _batchFunction = require("./batchFunction");

var _models = require("./models");

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SECRET = "12345";
var SECRET2 = "1234512345";

var typeDefs = (0, _mergeGraphqlSchemas.mergeTypes)((0, _mergeGraphqlSchemas.fileLoader)(_path2.default.join(__dirname, "./schema")));

var resolvers = (0, _mergeGraphqlSchemas.mergeResolvers)((0, _mergeGraphqlSchemas.fileLoader)(_path2.default.join(__dirname, "./resolvers")));

var schema = new _graphqlTools.makeExecutableSchema({
  typeDefs: typeDefs,
  resolvers: resolvers
});

var addUser = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(req, res, next) {
    var token, _ref2, user, refreshToken, newTokens;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            token = req.headers["xtoken"];

            if (!token) {
              _context.next = 18;
              break;
            }

            _context.prev = 2;
            _context.next = 5;
            return _jsonwebtoken2.default.verify(token, SECRET);

          case 5:
            _ref2 = _context.sent;
            user = _ref2.user;

            req.user = user;
            _context.next = 18;
            break;

          case 10:
            _context.prev = 10;
            _context.t0 = _context["catch"](2);
            refreshToken = req.headers["xrefreshtoken"];
            _context.next = 15;
            return (0, _auth.refreshTokens)(token, refreshToken, _models2.default, SECRET, SECRET2);

          case 15:
            newTokens = _context.sent;

            req.user = newTokens.user;

            if (newTokens.token && newTokens.refreshToken) {
              // res.set("Access-Control-Expose-Headers", "*");
              res.setHeader("xToken", newTokens.token);
              res.setHeader("xRefreshToken", newTokens.refreshToken);
            }

          case 18:
            next();

          case 19:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, undefined, [[2, 10]]);
  }));

  return function addUser(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();
var uploadDir = "files";

var fileMiddleware = function fileMiddleware(req, res, next) {
  if (!req.is("multipart/form-data")) {
    return next();
  }

  var form = _formidable2.default.IncomingForm({
    uploadDir: uploadDir
  });

  form.parse(req, function (error, _ref3, files) {
    var operations = _ref3.operations;

    if (error) {
      console.log(error);
    }

    var document = JSON.parse(operations);

    if ((0, _keys2.default)(files).length) {
      var _files$file = files.file,
          type = _files$file.type,
          filePath = _files$file.path;


      document.variables.file = {
        type: type,
        path: filePath
      };
    }

    req.body = document;
    next();
  });
};

var app = (0, _express2.default)();
app.use((0, _cors2.default)());
// app.use(bodyParser.json());
app.use("/files", _express2.default.static("files"));

app.use(addUser);
app.use(fileMiddleware);
app.use((0, _expressGraphql.graphqlHTTP)(function (req, res) {
  res.set({ "Access-Control-Expose-Headers": "*" }); // The frontEnd can read refreshToken

  return {
    schema: schema,
    context: {
      models: _models2.default,
      user: req.user,
      SECRET: SECRET,
      SECRET2: SECRET2,
      channelLoader: new _dataloader2.default(function (ids) {
        return (0, _batchFunction.channelBatcher)(ids, _models2.default, req.user);
      }),
      serverUrl: req.protocol + "://" + req.get("host")
    },
    graphiql: true
    // subsriptionsEndpoint: "ws://localhost:8081/subscriptions",
  };
}));

var server = (0, _http.createServer)(app);

_models2.default.sequelize.sync().then(function () {
  server.listen(8080, function () {
    console.log("server on port 8080");
    new _subscriptionsTransportWs.SubscriptionServer({
      execute: _graphql.execute,
      subscribe: _graphql.subscribe,
      schema: schema,
      onConnect: function () {
        var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(_ref5, webSoket) {
          var token = _ref5.token,
              refreshToken = _ref5.refreshToken;

          var _ref6, user, newTokens;

          return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  if (!(token && refreshToken)) {
                    _context2.next = 15;
                    break;
                  }

                  _context2.prev = 1;
                  _context2.next = 4;
                  return _jsonwebtoken2.default.verify(token, SECRET);

                case 4:
                  _ref6 = _context2.sent;
                  user = _ref6.user;
                  return _context2.abrupt("return", { models: _models2.default, user: user });

                case 9:
                  _context2.prev = 9;
                  _context2.t0 = _context2["catch"](1);
                  _context2.next = 13;
                  return (0, _auth.refreshTokens)(token, refreshToken, _models2.default, SECRET, SECRET2);

                case 13:
                  newTokens = _context2.sent;
                  return _context2.abrupt("return", { models: _models2.default, user: newTokens.user });

                case 15:
                  return _context2.abrupt("return", {});

                case 16:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2, undefined, [[1, 9]]);
        }));

        return function onConnect(_x4, _x5) {
          return _ref4.apply(this, arguments);
        };
      }()
    }, {
      server: server,
      path: "/subscriptions"
    });
  });
});

// {force:true}