import { UserInputError } from 'apollo-server';


function validateRegisterData(firstname, email, password, confirmPassword) {
    if (firstname.trim() === '') {
        throw new UserInputError('Firstname should not be empty');
    }
    if (email.trim() === '') {
        throw new UserInputError('Email should not be empty');
    } else {
        const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
        if (!email.match(regEx)) {
            throw new UserInputError('Email should be a valid email address');
        }
    }
    if (password === '') {
        throw new UserInputError('Password should not empty');
    } else if (password !== confirmPassword) {
        throw new UserInputError('Passwords should match');
    }
}
export default validateRegisterData;