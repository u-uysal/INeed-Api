import { UserInputError } from 'apollo-server';
import bcrypt from 'bcryptjs';
import gql from 'graphql-tag';
import jwt from 'jsonwebtoken';
import logger from '../../../logger';
import User from '../../Models/User';
import validateRegisterData from '../../Utils/validator';

export const UserTypeDef = gql`
  # extend type Query {
  #   book: String
  # }

  type User {
    id: ID!
    email: String!
    username: String!
    token: String!
    createdAt: String!
  }
  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }

  type Mutation {
    register(data: RegisterInput): User!
  }
`;

export const UserResolvers = {
  Mutation: {
    async register(_, { data: { username, password, confirmPassword, email } }) {
      // validate the data
      validateRegisterData(username, email, password, confirmPassword);
      // make sure user is not already exists
      const user = await User.findOne({ email });
      if (user) {
        throw new UserInputError('This user is already exists');
      }

      // hash password and auth process
      password = await bcrypt.hash(password, 12);
      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString(),
      });

      const response = await newUser.save();

      const token = jwt.sign(
        {
          id: response.id,
          email: response.email,
          username: response.username,
        },
        process.env.SECRET_KEY,
        { expiresIn: '2h' },
      );
      logger.info(response);

      return { ...response._doc, id: response.id, token };
    },
  },
};
