import gql from 'graphql-tag';

export const BookTypeDef = gql`
  extend type Query {
    book: String
  }

  type Book {
    title: String
    author: Author
  }
`;

export const BookResolvers = {
  Query: {
    book: () => 'kitap',
  },
  Book: {
    author: () => 'Tum yazar listesi',
  },
};
