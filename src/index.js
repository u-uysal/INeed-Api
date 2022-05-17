import { makeExecutableSchema } from '@graphql-tools/schema';
import { ApolloServer } from 'apollo-server';
import dotenv from 'dotenv';
import { merge } from 'lodash';
import mongoose from 'mongoose';
import logger from '../logger';
import { AuthorResolvers, AuthorTypeDef } from './graphql/Author';
import { BookResolvers, BookTypeDef } from './graphql/Book';

dotenv.config();

const URI = process.env.DB_URI;

const Query = `
  type Query {
    _empty: String
  }
`;

const schema = makeExecutableSchema({
  typeDefs: [Query, AuthorTypeDef, BookTypeDef],
  resolvers: merge({}, AuthorResolvers, BookResolvers),
});

const server = new ApolloServer({ schema });

mongoose
  .connect(URI)
  .then(() => {
    logger.info('Database connection is ok!');
  })
  .catch(err => {
    logger.error(err);
  });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  logger.info(`Server ready at ${url} 🚀 `);
});
