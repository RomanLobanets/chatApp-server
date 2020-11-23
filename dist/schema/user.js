"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = "\n  type User {\n    id: Int!\n    username: String!\n    email: String!\n    messages: Message!\n    teams: [Team!]!\n  }\n  \n  type Query{\n    me:User!\n    allUsers:[User!]!\n    getUser(userId: Int!): User\n  }\n\n  type RegisterResponce{\n    ok: Boolean!\n    user: User\n    errors:[Error!]\n  }\n  type LoginResponce{\n    ok: Boolean!\n    token: String\n    refreshToken: String \n    errors:[Error!]\n  }\n\n  type Mutation{\n    register(username:String!,email:String!,password:String!):RegisterResponce!\n    login(email:String!,password:String!):LoginResponce!\n  }\n";