import { requiersAuth, requiresTeamAccess } from "../permission";
import { PubSub, withFilter } from "graphql-subscriptions";
import pubsub from "../pubsub";
import { GraphQLScalarType } from "graphql";
import { Kind } from "graphql/language";

const NEW_CHANNEL_MESSAGE = "NEW_CHANNEL_MESSAGE";

export default {
  Date: new GraphQLScalarType({
    name: "Date",
    description: "Date custom scalar type",
    parseValue(value) {
      console.log("----------------------------1", new Date(value));
      return new Date(value); // value from the client
    },
    serialize(value) {
      console.log("----------------------------2", value, new Date(value));
      return value; // .getTime(); // value sent to the client
    },
    parseLiteral(ast) {
      console.log("----------------------------3");
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10); // ast value is always in string format
      }
      return null;
    },
  }),

  Subscription: {
    newChannelMessage: {
      subscribe: requiresTeamAccess.createResolver(
        withFilter(
          (parent, { channelId }, { models, user }) =>
            pubsub.asyncIterator(NEW_CHANNEL_MESSAGE),

          (payload, args) => payload.channelId === args.channelId
        )
      ),
    },
  },
  Message: {
    url: (parent, args, { serverUrl }) =>
      parent.url ? `${serverUrl}/${parent.url}` : parent.url,
    user: async ({ user, userId }, args, { models }) => {
      if (user) {
        return user;
      }
      return await models.User.findOne({ where: { id: userId } });
    },
  },
  Query: {
    messages: requiersAuth.createResolver(
      async (parent, { channelId, cursor }, { models, user }) => {
        const channel = await models.Channel.findOne({
          raw: true,
          where: { id: channelId },
        });
        if (!channel.public) {
          const member = await models.PCMember.findOne({
            raw: true,
            where: { channelId, userId: user.id },
          });
          if (!member) {
            throw new Error("Not Authorized");
          }
        }

        const options = {
          where: { channelId },
          order: [["createdAt", "DESC"]],
          limit: 10,
        };

        if (cursor) {
          options.where.createdAt = {
            [models.op.lt]: cursor,
          };
        }
        const messages = await models.Message.findAll(options, { raw: true });

        return messages;
      }
    ),
  },
  Mutation: {
    createMessage: requiersAuth.createResolver(
      async (parent, { file, ...args }, { models, user }) => {
        try {
          const messageData = args;

          if (file) {
            messageData.filetype = file.type;
            messageData.url = file.path;
          }
          const message = await models.Message.create({
            ...messageData,
            userId: user.id,
          });

          const currentUser = await models.User.findOne({
            where: { id: user.id },
          });

          pubsub.publish(NEW_CHANNEL_MESSAGE, {
            channelId: args.channelId,
            newChannelMessage: {
              ...message.dataValues,
              user: currentUser.dataValues,
            },
          });

          return true;
        } catch (err) {
          console.log(err);
          return false;
        }
      }
    ),
  },
};
