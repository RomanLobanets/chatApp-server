"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = "\n  scalar Date\n  type Message {\n    id: Int!\n    text: String\n    user: User!\n    channel: Channel!\n    createdAt: Date!\n    url: String\n    filetype: String\n  }\n\n  input File {\n    type: String!,\n    path: String!,\n  }\n\n  type Subscription{\n    newChannelMessage(channelId: Int!): Message!\n  }\n\n  type Query{\n    messages( cursor:String, channelId: Int!):[Message!]!\n  }\n\n  type Mutation{\n    createMessage(channelId: Int!, text: String file: File): Boolean!\n  }\n";