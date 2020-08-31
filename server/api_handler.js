const fs = require('fs');
const { ApolloServer, AuthenticationError } = require('apollo-server-express');
const { setAboutMessage, getMessage } = require('./about.js');
const issue = require('./issue.js');
const auth = require('./auth.js');

const GraphQLDate = require('./graphql_date.js');

const resolvers = {
  Query: {
    about: () => getMessage(),
    user: auth.resolveUser,
    issueList: issue.list,
    issue: issue.get,
    issueCounts: issue.counts,
  },
  Mutation: {
    setAboutMessage,
    issueAdd: issue.add,
    issueUpdate: issue.update,
    issueDelete: issue.delete,
    issueRestore: issue.restore,
  },
  GraphQLDate,
};

const server = new ApolloServer({
  resolvers,
  typeDefs: fs.readFileSync('./server/schema.graphql', 'utf-8'),
  formatError: error => {
    const { path, extensions } = error;
    console.log({ path, errors: extensions.errors, code: extensions.code });
    return error;
  },
  context: getContext,
  playground: true,
  introspection: true,
});

function installHandler(app) {
  const enableCors = (process.env.ENABLE_CORS || 'true') === 'true';
  console.log('CORS setting:', enableCors);
  let cors;
  if (enableCors) {
    const origin = process.env.UI_SERVER_ORIGIN || 'http://localhost:8000';
    const method = 'POST';
    cors = { origin, method, credentials: true };
  } else {
    cors = 'false';
  }
  console.log('Graphql Cors: ', cors);
  server.applyMiddleware({
    app,
    cors,
    path: '/graphql',
  });
}

function getContext({ req }) {
  const user = auth.getUser(req);
  return { user };
}

module.exports = { installHandler };
