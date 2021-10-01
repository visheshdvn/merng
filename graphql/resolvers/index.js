const postResolvers = require("./post");
const userResolvers = require("./users");
const commentsResolvers = require("./comments");

module.exports = {
  Query: {
    ...postResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...postResolvers.Mutation,
    ...commentsResolvers.Mutation,
  },
};
