export default `
  type User {
    id: Int!
    username: String!
    email: String!
    messages: Message!
    teams: [Team!]!
  }
  
  type Query{
    me:User!
    allUsers:[User!]!
    getUser(userId: Int!): User
  }

  type RegisterResponce{
    ok: Boolean!
    user: User
    errors:[Error!]
  }
  type LoginResponce{
    ok: Boolean!
    token: String
    refreshToken: String 
    errors:[Error!]
  }

  type Mutation{
    register(username:String!,email:String!,password:String!):RegisterResponce!
    login(email:String!,password:String!):LoginResponce!
  }
`;
