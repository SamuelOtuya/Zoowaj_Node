import { StatusCodes } from 'http-status-codes';
import AuthService from '../services/auth.service.js';
import UserService from '../services/user.service.js';
import logger from '../logger/logger.js';
import { BadRequestError, NotFoundError } from '../errors/application-error.js';
import asyncHandler from '../utils/asyncHandler.js';

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Email and password are required');
  }

  const authUser = await AuthService.validateUserCredentials(email, password);
  if (!authUser)
    throw new BadRequestError('Invalid Email or Password, Try again!');

  const token = AuthService.generateToken(authUser.toObject());
  logger.debug(`User login successful ${authUser.email}`);
  res.status(200).json({ token, user: authUser });
});

export const registerUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate all required fields
  if (!email || !password) {
    throw new BadRequestError('Email and password are required');
  }

  // Check if the email already exists
  const existingUser = await UserService.getUserByEmail(email);
  if (existingUser) {
    throw new BadRequestError('Email already exists');
  }

  const newUser = await UserService.createUser(email, password);
  // if (!newUser) throw new InternalServerError('Failed to create User');
  const token = await AuthService.generateToken(newUser);

  // Exclude the password from the response
  newUser.password = undefined;

  res.status(StatusCodes.CREATED).json({ user: newUser, token: token });
});

export const retrieveUserById = asyncHandler(async (req, res) => {
  let userId;
  const { id } = req.query;

  // Check if id is provided in the query
  if (id == null || id === undefined) {
    userId = req.userId; // Use req.userId if id is not provided
  } else {
    userId = id; // Use the id from the query parameter if it exists
  }

  // Fetch the user by userId
  const user = await UserService.getUserById(userId);

  // Check if user was found
  if (!user) {
    throw new NotFoundError('User not found');
  }

  return res.status(StatusCodes.OK).json(user);
});

export const authenticateUserToken = asyncHandler(async (req, res) => {
  const userId = req.userId;

  const user = await UserService.getUserById(userId);

  if (!user) throw new BadRequestError('invalid token');

  return res.status(StatusCodes.OK).json(user);
});

export const retrieveUserData = asyncHandler(async (req, res) => {
  const user = await UserService.getUserData(req.userId);
  return res.status(StatusCodes.OK).json(user);
});

export const retrieveUserWithData = asyncHandler(async (req, res) => {
  const user = await UserService.getUserWithData(req.userId);
  return res.status(StatusCodes.OK).json(user);
});

export const retrieveAllUsers = asyncHandler(async (req, res) => {
  const users = await UserService.getAll();
  return res.status(StatusCodes.OK).json(users);
});

export const retrieveAllUsersData = asyncHandler(async (req, res) => {
  const users = await UserService.getAllData();
  return res.status(StatusCodes.OK).json(users);
});

export const retrieveAllUsersWithData = asyncHandler(async (req, res) => {
  const users = await UserService.getAllWithData();
  return res.status(StatusCodes.OK).json(users);
});

export const retrieveCombinedData = asyncHandler(async (req, res) => {
  const data = await UserService.getAllCombinedData();
  return res.status(StatusCodes.OK).json(data);
});

export const retrieveAggregateData = asyncHandler(async (req, res) => {
  const data = await UserService.getAggregateData();
  return res.status(StatusCodes.OK).json(data);
});
