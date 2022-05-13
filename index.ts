const { ApolloServer, gql } = require('apollo-server');
const mongoose = require('mongoose');
const logger = require('./logger');
require('dotenv').config();

const URI = process.env.DB_URI;

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  type Query {
    sayHi: String!
  }
`;

const resolvers = {
  Query: {
    sayHi: () => 'hello',
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: true,
});

mongoose
  .connect(URI, {
    useNewUrlParser: true,
  })
  .then(() => {
    logger.info('Database connection is ok!');
  })
  .catch((err: any) => {
    logger.error(err);
  });

// The `listen` method launches a web server.
server.listen().then(({ url }: { url: string }) => {
  logger.info(`Server ready at ${url} 🚀 `);
});
