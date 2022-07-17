import { UserInputError } from 'apollo-server';
import bcrypt from 'bcryptjs';
import gql from 'graphql-tag';
import logger from '../../../logger';
import User from '../../Models/User';
import { generateToken, validateLoginData, validateRegisterData } from '../../Utils/validator';

export const UserTypeDef = gql`
  # extend type Query {
  #   book: String
  # }

  type User {
    id: ID!
    email: String!
    firstname: String!
    lastname: String!
    token: String!
    createdAt: String!
  }
  input RegisterInput {
    firstname: String!
    lastname: String!
    password: String!
    confirmPassword: String!
    email: String!
  }

  type rstPasswort {
    id: ID!
    email: String!
    token: String!
  }
  input resetPasswortData {
    email: String!
    password: String!
    confirmPassword: String!
  }

  type Mutation {
    register(
      firstname: String!
      lastname: String!
      password: String!
      confirmPassword: String!
      email: String!
    ): User!
    login(password: String!, email: String!): User!
    resetPasswort(data: resetPasswortData): rstPasswort!
  }
`;

export const UserResolvers = {
  Mutation: {
    async register(_, { firstname, lastname, password, confirmPassword, email }) {
      // validate the data
      validateRegisterData(firstname, email, password, confirmPassword);
      // make sure user is not already exists
      const user = await User.findOne({ email });
      if (user) {
        throw new UserInputError('This user is already exists');
      }

      // hash password and auth process
      password = await bcrypt.hash(password, 12);
      const newUser = new User({
        email,
        firstname,
        lastname,
        password,
        createdAt: new Date().toISOString(),
      });

      const response = await newUser.save();

      const token = generateToken(response);
      logger.info(response);

      return { ...response._doc, id: response.id, token };
    },
    async login(_, { email, password }) {
      validateLoginData(email, password);

      const user = await User.findOne({ email });
      if (!user) {
        throw new UserInputError('Invalid credentials');
      }

      const isEqual = await bcrypt.compare(password, user.password);
      if (!isEqual) {
        throw new UserInputError('Invalid credentials');
      }

      const token = generateToken(user);

      return { ...user._doc, id: user.id, token };
    },
  },
};
