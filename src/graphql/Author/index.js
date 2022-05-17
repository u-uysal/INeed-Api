import gql from 'graphql-tag';

export const AuthorTypeDef = gql`
  extend type Query {
    author: String
  }

  type Author {
    id: Int!
    firstName: String
    lastName: String
    books: [Book]
  }
`;

export const AuthorResolvers = {
  Query: {
    author: () => 'calismali',
  },
  Author: {
    books: () => 'Tum kitap listesi',
  },
};
