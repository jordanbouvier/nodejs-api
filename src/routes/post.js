/**
 * Npm import
 */
import express from 'express';
import { body } from 'express-validator/check';
/**
 * Local import
 */
import {
  getPosts,
  createPost,
  putPost,
  deletePost
} from '../controllers/post'

import { isAuth } from '../middlewares/auth'
import { dataValidation, editValidation } from '../models/validation/post';


const Router = express.Router();

/**
 * Routes
 */

Router.get('/post', getPosts);
Router.post('/post', isAuth,  dataValidation(), createPost);
Router.put('/post/:id', isAuth, editValidation(), putPost);
Router.delete('/post/:id', isAuth, deletePost);



/**
 * Export
 */
export default Router;


