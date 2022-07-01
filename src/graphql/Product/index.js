import gql from 'graphql-tag';
import logger from '../../../logger';
import Product from '../../Models/Product';

export const ProductTypeDef = gql`
  type Product {
    id: ID!
    productName: String!
    description: String!
    price: String!
    image: String
    categoryName: String
  }
  input ProductInput {
    productName: String!
    description: String!
    image: String
    price: String!
    categoryName: String!
  }

  type Mutation {
    product(data: ProductInput): Product!
  }
`;
export const ProductResolvers = {
  Mutation: {
    async product(_, { data: { productName, description, image, price, categoryName } }) {
      const newProduct = new Product({
        productName,
        description,
        image,
        price,
        categoryName,
        createdAt: new Date().toISOString(),
      });

      const response = await newProduct.save();
      logger.info(response);
      return { ...response._doc, id: response.id };
    },
  },
};
