"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = "\n  type Team {\n    id:Int!\n    name: String!\n    directMessageMembers: [User!]!\n    channels: [Channel!]!\n    admin:Boolean!\n  }\ntype CreateTeamResponce {\n  ok: Boolean!\n  team:Team\n  errors:[Error!]\n}\ntype Query{\n  AllTeams:[Team!]!\n  inviteTeams:[Team!]!\n  getTeamMembers(teamId:Int!):[User!]!\n}\n\ntype VoidResponse{\n  ok: Boolean!\n  errors:[Error!]\n}\n\n\n  type Mutation{\n    createTeam(name:String!): CreateTeamResponce!\n    addTeamMember(email: String!,teamId: Int!): VoidResponse!\n  }\n";