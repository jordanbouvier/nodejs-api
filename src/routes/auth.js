/**
 * Npm import
 */
import express from 'express';

/**
 * Local import
 */
import User from '../models/user';

import {
  postRegister,
  postLogin,
} from '../controllers/auth';

import { creationValidation } from '../models/validation/user'

const Router = express.Router();

Router.post('/register', creationValidation(), postRegister);
Router.post('/signin', User.signInValidation(), postLogin);

export default Router;