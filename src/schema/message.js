export default `
  scalar Date
  type Message {
    id: Int!
    text: String
    user: User!
    channel: Channel!
    createdAt: Date!
    url: String
    filetype: String
  }

  input File {
    type: String!,
    path: String!,
  }

  type Subscription{
    newChannelMessage(channelId: Int!): Message!
  }

  type Query{
    messages( cursor:String, channelId: Int!):[Message!]!
  }

  type Mutation{
    createMessage(channelId: Int!, text: String file: File): Boolean!
  }
`;
