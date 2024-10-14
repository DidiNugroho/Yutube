const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");

const {userTypeDefs, userResolvers} = require('./schema/user')
// const {postTypeDefs, postResolvers} = require('./schema/post')
// const {followTypeDefs, followResolvers} = require('./schema/follow')

const server = new ApolloServer({
  typeDefs: [userTypeDefs], // , postTypeDefs, followTypeDefs
  resolvers: [userResolvers], // , postResolvers, followResolvers
});

// Start the standalone server
startStandaloneServer(server, {
  listen: { port: 3000 },
}).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
