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

  type ToggleFollowResponse {
    success: Boolean!
    message: String!
    follow: Follow
  }

  type Mutation {
    toggleFollow(followingId: ID!): ToggleFollowResponse!
  }
`;

//Resolvers
const followResolvers = {
  Mutation: {
    toggleFollow: async (_, { followingId }, context) => {
      const user = await context.authentication();

      const existingFollow = await FollowModel.findFollow({
        followingId,
        followerId: user._id
      });

      if (existingFollow) {
        await FollowModel.unfollow({followingId, followerId: user._id});
        return {
          success: true,
          message: "Unfollowed successfully",
          follow: null,
        };
      } else {
        const newFollow = await FollowModel.follow({followingId, followerId: user._id});
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
