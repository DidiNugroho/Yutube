const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");

const { userTypeDefs, userResolvers } = require("./schema/user");
const { postTypeDefs, postResolvers } = require("./schema/post");
const { followTypeDefs, followResolvers } = require("./schema/follow");
const { verifyToken } = require("./helpers/jwt");
const UserModel = require("./models/userModel");

const server = new ApolloServer({
  typeDefs: [userTypeDefs, postTypeDefs, followTypeDefs],
  resolvers: [userResolvers, postResolvers, followResolvers],
  introspection: true,
  csrfPrevention: true
});

const PORT = process.env.PORT || 3000;

// Start the standalone server
startStandaloneServer(server, {
  listen: { 
    host: "0.0.0.0",
    port: PORT 
  },

  context: ({ req }) => {
    return {
      authentication: async () => {
        const authorization = req.headers.authorization;
        if (!authorization) throw new Error("You have to login first!");

        const token = authorization.split(" ")[1];
        const decoded = verifyToken(token);
        const user = await UserModel.getUser(decoded._id);
        return user;
      },
    };
  },
}).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);

  process.on("SIGINT", () => {
    console.log("Shutting down the server...");
    server.stop().then(() => {
      process.exit(0);
    });
  });

  process.on("SIGTERM", () => {
    console.log("Shutting down the server...");
    server.stop().then(() => {
      process.exit(0);
    });
  });
});
