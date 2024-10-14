//Schema
const followTypeDefs = `#graphql  
  type Follow {
    _id: ID!
    followingId: ID!
    followerId: ID!
    createdAt: String!
    updatedAt: String
  }
`;

// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
const followResolvers = {
  Query: {},
};

module.exports = { followResolvers, followTypeDefs };
