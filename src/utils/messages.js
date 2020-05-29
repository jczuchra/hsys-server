// © 2020 Jakub Czuchra All Rights Reserved

import {
  firstLetterToLowerCase,
  firstLetterToUpperCase,
} from './helperFunctions';

const messages = {
  'server.src.datasources.asset': {
    create: {
      success: 'Device category created succesfully.',
      exists: 'Category with this name already exists.',
    },
    delete: {
      success: 'Device category sucessfully deleted.',
      error: "You can't delete this category.",
    },
  },
  'server.src.datasources.user': {
    register: {
      success: 'User created succesfully.',
      exists: 'User with this email address already exist.',
    },
    login: {
      success: 'You logged in succesfully.',
      passwordError: 'Password does not match to this email address.',
      errorExists: 'This user does not exist.',
    },
  },
  'server.resolvers.auth': {
    notLoggedIn: 'You have to login first',
  },
};

export const createSuccess = (type) =>
  `${firstLetterToUpperCase(type)} created succesfully.`;
export const createExists = (type) =>
  `${firstLetterToUpperCase(type)} with this name already exists.`;
export const deleteSuccess = (type) =>
  `${firstLetterToUpperCase(type)} sucessfully deleted.`;
export const deleteExists = (type) =>
  `${firstLetterToUpperCase(type)} with this id does not exist.`;
export const deleteNotAllowed = (type) =>
  `You can't delete this ${firstLetterToLowerCase(type)}.`;

export const generateCreateMessages = (type) => ({
  success: createSuccess(type),
  exists: createExists(type),
});

export const generateDeleteMessages = (type) => ({
  success: deleteSuccess(type),
  error: deleteNotAllowed(type),
  exists: deleteExists(type),
});

export default messages;
