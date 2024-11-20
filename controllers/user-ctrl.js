import { StatusCodes } from 'http-status-codes';
import AuthService from '../services/auth.service.js';
import UserService from '../services/user.service.js';
import logger from '../logger/logger.js';
import { BadRequestError, InternalServerError } from '../errors/errors.js';
import asyncHandler from '../utils/asyncHandler.js';

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Please provide both email and password to continue');
  }

  const user = await UserService.getUserByEmail(email);

  if (!user) throw new BadRequestError('User Account with the Email does not exist');

  const authUser = await AuthService.validateUserCredentials(email, password);
  if(!authUser) throw new BadRequestError('Invalid Password');

  const token = AuthService.generateToken(user.toObject());
  logger.debug(`User login successful ${authUser.email}`);
  res.status(200).json({ message: 'Login successful', token, authUser });
});


export const registerUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate all required fields
  if (!email || !password) {
    throw new BadRequestError('Email and password are required');
  }

  const newUser = await UserService.createUser(email, password);
  if(!newUser) throw new InternalServerError('Failed to create User');
  const token = await AuthService.generateToken(newUser);

  // Exclude the password from the response
  newUser.password = undefined;

  res.status(StatusCodes.CREATED).json({ user: newUser, token: token });
});

export const retrieveAllUsers = async (req, res) => {
  const users = await UserService.getAll();
  return res.status(StatusCodes.OK).json(users);
};

export const retrieveUserById = asyncHandler(async (req, res) => {
  const { id } = req.query;
  const user = await UserService.getuserById(id);
  return res.status(StatusCodes.OK).json(user);
});
