import express from "express";
import bodyParser from "body-parser";

import { createServer } from "http";
import { execute, subscribe } from "graphql";
import { SubscriptionServer } from "subscriptions-transport-ws";

import { graphqlHTTP } from "express-graphql";
import { ApolloServer, gql } from "apollo-server-express";
import { makeExecutableSchema } from "graphql-tools";
import path from "path";
import { fileLoader, mergeTypes, mergeResolvers } from "merge-graphql-schemas";
import cors from "cors";
import jwt from "jsonwebtoken";
import { refreshTokens } from "./auth";
import formidable from "formidable";
import Dataloader from "dataloader";
import { channelBatcher } from "./batchFunction";

import models from "./models";
const SECRET = "12345";
const SECRET2 = "1234512345";

const typeDefs = mergeTypes(fileLoader(path.join(__dirname, "./schema")));

const resolvers = mergeResolvers(
  fileLoader(path.join(__dirname, "./resolvers"))
);

const schema = new makeExecutableSchema({
  typeDefs,
  resolvers,
});

const addUser = async (req, res, next) => {
  const token = req.headers["xtoken"];
  if (token) {
    try {
      const { user } = await jwt.verify(token, SECRET);
      req.user = user;
    } catch (err) {
      const refreshToken = req.headers["xrefreshtoken"];

      const newTokens = await refreshTokens(
        token,
        refreshToken,
        models,
        SECRET,
        SECRET2
      );
      req.user = newTokens.user;

      if (newTokens.token && newTokens.refreshToken) {
        // res.set("Access-Control-Expose-Headers", "*");
        res.setHeader("xToken", newTokens.token);
        res.setHeader("xRefreshToken", newTokens.refreshToken);
      }
    }
  }
  next();
};
const uploadDir = "files";

const fileMiddleware = (req, res, next) => {
  if (!req.is("multipart/form-data")) {
    return next();
  }

  const form = formidable.IncomingForm({
    uploadDir,
  });

  form.parse(req, (error, { operations }, files) => {
    if (error) {
      console.log(error);
    }

    const document = JSON.parse(operations);

    if (Object.keys(files).length) {
      const {
        file: { type, path: filePath },
      } = files;

      document.variables.file = {
        type,
        path: filePath,
      };
    }

    req.body = document;
    next();
  });
};

const app = express();
app.use(cors());
// app.use(bodyParser.json());
app.use("/files", express.static("files"));

app.use(addUser);
app.use(fileMiddleware);
app.use(
  graphqlHTTP((req, res) => {
    res.set({ "Access-Control-Expose-Headers": "*" }); // The frontEnd can read refreshToken

    return {
      schema,
      context: {
        models,
        user: req.user,
        SECRET,
        SECRET2,
        channelLoader: new Dataloader((ids) =>
          channelBatcher(ids, models, req.user)
        ),
        serverUrl: `${req.protocol}://${req.get("host")}`,
      },
      graphiql: true,
      // subsriptionsEndpoint: "ws://localhost:8081/subscriptions",
    };
  })
);

const server = createServer(app);

models.sequelize.sync().then(() => {
  server.listen(8080, () => {
    console.log("server on port 8080");
    new SubscriptionServer(
      {
        execute,
        subscribe,
        schema,
        onConnect: async ({ token, refreshToken }, webSoket) => {
          if (token && refreshToken) {
            try {
              const { user } = await jwt.verify(token, SECRET);
              return { models, user };
            } catch (err) {
              const newTokens = await refreshTokens(
                token,
                refreshToken,
                models,
                SECRET,
                SECRET2
              );
              return { models, user: newTokens.user };
            }
            // const member = await models.Member.findOne({
            //   where: { teamId: 1, userId: user.id },
            // });
            // if (!member) {
            //   throw new Error("Missing auth");
            // }
          }
          return {};
        },
      },
      {
        server: server,
        path: "/subscriptions",
      }
    );
  });
});

// {force:true}
