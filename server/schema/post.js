const PostModel = require("../models/postModel");

//Schema
const postTypeDefs = `#graphql

  type Post {
    _id: ID!
    content: String!
    tags: [String!]
    imgUrl: String
    authorId: ID!
    comments: [Comment]
    likes: [Like]
    createdAt: String!
    updatedAt: String
    authorData: AuthorData!
  }

  type AuthorData {
    _id: ID!
    name: String!
    username: String!
    email: String!
  }

  type Like {
    username: String!
    createdAt: String!
    updatedAt: String!
  }

  type Comment {
    content: String!
    username: String!
    createdAt: String!
    updatedAt: String!
  }


  type Query {
    getPost(id: ID!): Post
    getAllPosts: [Post!]!
  }

  type Mutation {
    createPost(content: String!, tags: [String], imgUrl: String, authorId: ID!): Post!
    addComment(postId: ID!, content: String!, authorId: ID!): Post!
    likePost(postId: ID!, userId: ID!): Post!
  }

  `;

const postResolvers = {
  Query: {
    getPost: async (_, { id }) => {
      return await PostModel.getPostById(id);
    },
    getAllPosts: async () => {
      return await PostModel.getAllPosts();
    },
  },
  Mutation: {
    createPost: async (_, { content, tags, imgUrl, authorId }, context) => {
      const user = await context.authentication();
      const newPost = await PostModel.createPost({content, tags, imgUrl, authorId: user._id});
      return newPost
    },
    addComment: async (_, { postId, content, authorId }) => {
      const user = await context.authentication();
      return await PostModel.addComment({postId, content, authorId: user._id});
    },
    likePost: async (_, { postId, userId }) => {
      const user = await context.authentication();
      return await PostModel.likePost({postId, userId: user._id});
    },
  },
}; 

module.exports = { postResolvers, postTypeDefs };
