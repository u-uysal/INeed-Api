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

  # where do you use this?
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

  type Mutation {
    register(data: RegisterInput): User!
    # if number of arguments is lower than 3, dont need to create an input type
    # login mutation will always return User type
    login(password: String!, email: String!): User!
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

      const token = generateToken(response);
      logger.info(response);

      return { ...response._doc, id: response.id, token };
    },
    async login(_, { email, password }) {
      validateLoginData(email, password);

      // dont need to use email twice. If key and value are same, you can use just key
      const user = await User.findOne({ email });
      if (!user) {
        throw new UserInputError('Invalid credentials');
      }

      const isEqual = await bcrypt.compare(password, user.password);
      if (!isEqual) {
        throw new UserInputError('Invalid credentials');
      }

      const token = generateToken(user);

      // never push your secret key. Use environment variable instead.

      // const token = jwt.sign({ id: user.id, email: user.email }, 'somesupersecretkey', {
      //   expiresIn: '2h',
      // });
      return { ...user._doc, id: user.id, token };
    },
  },
};
// we create a resolver only for the entity. Now the entity is the User since we are in the User folder.
// Dont need to create another resolver inside the entity.
// export const LoginResolvers = {
//   Mutation: {},
// };

// we create a resolver only for the entity. Now the entity is the User since we are in the User folder.
// todo create a forgotPasswordResolvers inside the entity.

// export const forgotPasswordResolvers = {
//   Mutation: {
//     async resetPasswort(_, { data: { email, password, confirmPassword } }) {
//       if (password !== confirmPassword) {
//         throw new Error("Your passwords don't match");
//       }
//       const filter = { email };
//       const update = { password };
//       const saltRounds = 12;
//       const hash = await bcrypt.hash(password, saltRounds);
//       const doc = await User.findOneAndUpdate(filter, update);
//       if (!doc) throw new Error('Your password reset token is either invalid or expired.');
//       return doc;
//     },
//   },
// };
