const FollowModel = require("../models/followModel");

//Schema
const followTypeDefs = `#graphql  
  type Follow {
    _id: ID!
    followingId: ID!
    followerId: ID!
    createdAt: String!
    updatedAt: String
  }

  type Query {
    getFollowers(userId: ID!): [Follow!]!
    getFollowing(userId: ID!): [Follow!]!
  }

  type Mutation {
    toggleFollow(followingId: ID!, followerId: ID!): Follow!
  }
`;

//Resolvers
const followResolvers = {
  Query: {
    getFollowers: async (_, { userId }) => {
      return await FollowModel.getFollowers(userId);
    },
    getFollowing: async (_, { userId }) => {
      return await FollowModel.getFollowing(userId);
    },
  },
  Mutation: {
    toggleFollow: async (_, { followingId, followerId }) => {
      const existingFollow = await FollowModel.findFollow(
        followingId,
        followerId
      );

      if (existingFollow) {
        await FollowModel.unfollow(followingId, followerId);
        return { followingId, followerId, message: "Unfollowed" };
      } else {
        const newFollow = await FollowModel.follow(followingId, followerId);
        return newFollow;
      }
    },
  },
};

module.exports = { followResolvers, followTypeDefs };
