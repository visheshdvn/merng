const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers/index");
const { MONGODB } = require("./config");

const server = new ApolloServer({ typeDefs, resolvers });

mongoose.connect(MONGODB, { useNewUrlParser: true }).then(() => {
  return server.listen({ port: 5001 }).then((res) => {
    console.log("Server running at", res.url);
  });
});
