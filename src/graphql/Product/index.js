import gql from 'graphql-tag';
import Product from '../../Models/Product';

export const ProductTypeDef = gql `
  # extend type Query {
  #   book: String
  # }

  type Product {
    marke: String!
    bauJahr: String!
    kilometer: String!
    preis: String!
  }
  input ProductInput {
    marke: String!
    bauJahr: String!
    kilometer: String!
    preis: String!
  }

  type Mutation {
    addProduct(data: ProductInput): Product!
  }
`;

export const ProductResolvers = {
    Mutation: {
        async addProduct(_, { data: { marke, bauJahr, kilometer, preis } }) {
            const newProduct = new Product({
                marke,
                bauJahr,
                kilometer,
                preis,
                //createdAt: new Date().toISOString(),
            });

            const response = await newProduct.save();

            return {...response._doc, id: response.id };
        },
    },
};