const FollowModel = require("../models/followModel");

//Schema
const followTypeDefs = `#graphql  
  type Follow {
    _id: ID!
    followingId: ID!
    followerId: ID!
    createdAt: String!
    updatedAt: String
    userData: UserData!
  }

  type UserData {
    _id: ID!
    name: String!
    username: String!
  }

  type Query {
    getFollowers(userId: ID!): [Follow!]!
    getFollowing(userId: ID!): [Follow!]!
  }

  type ToggleFollowResponse {
    success: Boolean!
    message: String!
    follow: Follow
  }

  type Mutation {
    toggleFollow(followingId: ID!, followerId: ID!): ToggleFollowResponse!
  }
`;

//Resolvers
const followResolvers = {
  Query: {
    getFollowers: async (_, { userId }) => {
      const followers = await FollowModel.getFollowers(userId);
      return followers;
    },
    getFollowing: async (_, { userId }) => {
      const following = await FollowModel.getFollowing(userId);
      return following;
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
        return {
          success: true,
          message: "Unfollowed successfully",
          follow: null,
        };
      } else {
        const newFollow = await FollowModel.follow(followingId, followerId);
        return {
          success: true,
          message: "Followed successfully",
          follow: newFollow,
        };
      }
    },
  },
};

module.exports = { followResolvers, followTypeDefs };
