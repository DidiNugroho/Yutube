const redis = require("../config/redis");
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
    _id: ID!
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
    createPost(content: String!, tags: [String], imgUrl: String): Post!
    addComment(postId: ID!, content: String!): Post!
    likePost(postId: ID!): Post!
  }

  `;

const postResolvers = {
  Query: {
    getPost: async (_, { id }) => {
      const posts = await PostModel.getPostById(id);

      if(!posts) {
        throw new Error("Post not found")
      }

      return posts
    },
    getAllPosts: async () => {
      
      const postsCache = await redis.get("posts:all")
      if(postsCache) {
        return JSON.parse(postsCache)
      }

      const posts = await PostModel.getAllPosts();

      if(!posts) {
        throw new Error("Post not found")
      }

      await redis.set("posts:all", JSON.stringify(posts))
      
      return posts;
    },
  },
  Mutation: {
    createPost: async (_, { content, tags, imgUrl }, context) => {
      const user = await context.authentication();
      
      const newPost = await PostModel.createPost({content, tags, imgUrl, authorId: user._id});
      
      await redis.del("posts:all")

      return newPost
    },
    addComment: async (_, { postId, content }, context) => {
      const user = await context.authentication();

      const newPost = await PostModel.addComment({postId, content, username: user.username});

      if(!newPost) throw new Error("Failed to add comment")

      await redis.del("posts:all");

      return newPost
    },
    likePost: async (_, { postId }, context) => {
      const user = await context.authentication();

      const likePost = await PostModel.likePost({postId, userId: user._id, username: user.username});

      await redis.del("posts:all");
      
      return likePost;
    },
  },
}; 

module.exports = { postResolvers, postTypeDefs };
