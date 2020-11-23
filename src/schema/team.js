export default `
  type Team {
    id:Int!
    name: String!
    directMessageMembers: [User!]!
    channels: [Channel!]!
    admin:Boolean!
  }
type CreateTeamResponce {
  ok: Boolean!
  team:Team
  errors:[Error!]
}
type Query{
  AllTeams:[Team!]!
  inviteTeams:[Team!]!
  getTeamMembers(teamId:Int!):[User!]!
}

type VoidResponse{
  ok: Boolean!
  errors:[Error!]
}


  type Mutation{
    createTeam(name:String!): CreateTeamResponce!
    addTeamMember(email: String!,teamId: Int!): VoidResponse!
  }
`;
