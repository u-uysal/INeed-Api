import { UserInputError } from 'apollo-server';
import bcrypt from 'bcryptjs';
import gql from 'graphql-tag';
import jwt from 'jsonwebtoken';
import logger from '../../../logger';
import Product from '../../Models/Product/Product';
import validateRegisterData from '../../Utils/validator';

export const ProductTypeDef = gql`
  # extend type Query {
  #   book: String
  # }

  type Product {
    name: String
    price: Int
  }
  input ProductInput {
    name: String
    price: Int
  }

  type Mutation {
    addProduct(data: ProductInput): Product!
  }

  extend type Query {
    getAllProducts: [Product]
  }
`;

export const ProductResolvers = {
  Mutation: {
    async addProduct(_, { data: { name, price } }) {
      const newProduct = new Product({
        name,
        price,
      });

      const response = await newProduct.save();

      logger.info(response);

      return { ...response._doc };
    },
  },
  Query: {
    getAllProducts: async () => await Product.find()
  },
};
