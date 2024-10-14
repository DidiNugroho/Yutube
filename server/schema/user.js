const { database } = require("../config/mongodb");
const { hashPassword } = require("../helpers/bcrypt");
const UserModel = require("../models/userModel");
const {verifyToken, signToken} = require('../helpers/jwt')

//Schema
//typeDefs
const userTypeDefs = `#graphql
    type User {
    _id: ID!
    name: String!
    username: String!
    email: String!
    password: String!
  }

  type Query {
    getUser(_id: ID!): User
    getUserByNameOrUsername(name: String, username: String): User
    getAllUsers: [User!]!
  }

  type AuthPayload {
    access_token: String!
  }

  type Mutation {
    registerUser(name: String!, username: String!, email: String!, password: String!): User!
    loginUser(email: String!, password: String!): AuthPayload!
  }
  `;

// Resolvers
const userResolvers = {
  Query: {
    getUserByNameOrUsername: async (_, { name, username }) => {
      const user = await UserModel.getUserByNameOrUsername(name, username); // Assuming you implement this method in your UserModel
      return user;
    },
    getUser: async (_, { _id }) => {
      const book = await UserModel.getUser(_id);
      return book;
    },
    getAllUsers: async () => {
      const users = await UserModel.getAllUsers();
      return users;
    },
  },
  Mutation: {
    registerUser: async (_, { name, username, email, password }) => {
      const isEmailValid = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
      };

      if (!isEmailValid(email)) {
        throw new Error("Invalid email format.");
      }

      if (!name || !username || !email || !password) {
        throw new Error("All fields are required.");
      }
      if (password.length < 5) {
        throw new Error("Password must be at least 5 characters long.");
      }

      const existingUser = await database
        .collection("users")
        .findOne({ email });

      if (existingUser) {
        throw new Error("Email already in use.");
      }

      const hashedPassword = hashPassword(password);
      const newUser = { name, username, email, password: hashedPassword };
      await UserModel.register(newUser);
      return newUser;
    },
    loginUser: async (_, { email, password }) => {
      const user = await UserModel.login(email, password);
      const token = signToken({
        _id: user._id,
        username: user.username,
        email: user.email
      }) 

      return {access_token: token};
    },
  },
};

module.exports = { userResolvers, userTypeDefs };
