// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
const postResolvers = {
  Query: {},
};

//Schema
const postTypeDefs = `#graphql
 type Post {
    _id: ID!
    content: String!
    tags: [String!]!
    imgUrl: String
    authorId: ID!
    comments: [Comment!]!
    likes: [Like!]!
    createdAt: String!
    updatedAt: String!
  }
  `;

module.exports = { postResolvers, postTypeDefs };
