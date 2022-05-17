import { UserInputError } from 'apollo-server';

const validateRegisterData = (username, email, password, confirmPassword) => {
  if (username.trim() === '') {
    throw new UserInputError('Username must not be empty');
  }
  if (email.trim() === '') {
    throw new UserInputError('Email must not be empty');
  } else {
    const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    if (!email.match(regEx)) {
      throw new UserInputError('Email must be a valid email address');
    }
  }
  if (password === '') {
    throw new UserInputError('Password must not empty');
  } else if (password !== confirmPassword) {
    throw new UserInputError('Passwords must match');
  }
};
export default validateRegisterData;
