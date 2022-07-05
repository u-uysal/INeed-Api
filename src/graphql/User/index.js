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
  type Login {
    id: ID!
    email: String!
    token: String!
    createdAt: String!
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

  input LoginInput {
    password: String!
    email: String!
  }

  type Mutation {
    register(data: RegisterInput): User!
    login(data: LoginInput): Login!
    resetPasswort(data: resetPasswortData): rstPasswort!
  }
`;

export const UserResolvers = {
  Mutation: {
    async register(_, { data: { firstname, lastname, password, confirmPassword, email } }) {
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

      const token = jwt.sign(
        {
          id: response.id,
          email: response.email,
          firstname: response.firstname,
        },
        process.env.SECRET_KEY,
        { expiresIn: '2h' },
      );
      logger.info(response);

      return { ...response._doc, id: response.id, token };
    },
  },
};

// LoginResolvers //
export const LoginResolvers = {
  Mutation: {
    async login(_, { data: { email, password } }) {
      const user = await User.findOne({ email: email });
      if (!user) {
        throw new Error('User does not exist!');
      }
      const isEqual = await bcrypt.compare(password, user.password);
      if (!isEqual) {
        throw new Error('Password is incorrect!');
      }
      const token = jwt.sign({ id: user.id, email: user.email }, 'somesupersecretkey', {
        expiresIn: '2h',
      });
      return { id: user.id, email: user.email, token: token, tokenExpiration: 1 };
    },
  },
};

// PasswordResolvers //
export const forgotPasswordResolvers = {
  Mutation: {
    async resetPasswort(_, { data: { email, password, confirmPassword } }) {
      if (password !== confirmPassword) {
        throw new Error(`Your passwords don't match`);
      }
      const filter = { email: email };
      const update = { password: password };
      const saltRounds = 12;
      const hash = await bcrypt.hash(password, saltRounds);
      let doc = await User.findOneAndUpdate(filter, update);
      if (!doc) throw new Error('Your password reset token is either invalid or expired.');
      return doc;
    },
  },
};
