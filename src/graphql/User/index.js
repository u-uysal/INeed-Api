import { UserInputError } from 'apollo-server';
import bcrypt from 'bcryptjs';
import gql from 'graphql-tag';
import jwt from 'jsonwebtoken';
import logger from '../../../logger';
import User from '../../Models/User';
import validateRegisterData from '../../Utils/validator';

export const UserTypeDef = gql `
  # extend type Query {
  #   book: String
  # }

  type User {
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

  type Mutation {
    register(data: RegisterInput): User!
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

            const token = jwt.sign({
                    id: response.id,
                    email: response.email,
                    firstname: response.firstname,
                },
                process.env.SECRET_KEY, { expiresIn: '2h' },
            );
            logger.info(response);

            return {...response._doc, id: response.id, token };
        },
    },
};