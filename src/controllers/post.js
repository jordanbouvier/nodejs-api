/**
 * Npm import 
 */
import mongoose from 'mongoose';
import { validationResult } from 'express-validator/check';

/**
 * Local import
 */
import Post from '../models/post';
import { isDifferent } from '../utils/diffCheck';
import { HttpException } from '../utils/errors';

export const getPosts = async (req, res, next) => {
  
  
  let page = parseInt(req.query.page) || 1;
  let nbPerPage = parseInt(req.query.nbPerPage) || 5;

  page = Math.abs(page);
  page = Math.floor(page);  

  nbPerPage = Math.abs(nbPerPage);
  nbPerPage = Math.floor(nbPerPage);  

  
  try {
    const postCount = await Post.countDocuments();
    const posts = await Post.find()
    .skip((page - 1) * nbPerPage)
    .limit(nbPerPage)
    .populate('author', 'username email');

    res.status(200).json({
      posts,
      currentPage: page,
      maxPage: Math.ceil(postCount / nbPerPage),
    });

  } catch(err) {
    console.log(err);
    const error = new Error('An error occured');
    error.statusCode = 500;
    return next(error);
  }
  
};

export const createPost =  async (req, res, next) => {

  const { title, imageUrl, message } = req.body;
  const errors = validationResult(req);

  if(!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Data validation failed',
      errors: errors.mapped()
    });
  }
  const { user } = req;

  const post = new Post({
    title,
    message,
    imageUrl,
    author: user._id,
  }); 
  
  const session =  await mongoose.startSession();

  // start transaction
  session.startTransaction();

  try {

    // save the post
    await post.save({ session });
    // add the post to the user


    user.posts.push({
      post: post._id,
    });

    // save the user
    await user.save({ session });

    // commit if no errors  
    await session.commitTransaction();
    
    res.status(201).json({
      post: post._doc,
    });
  } catch(err) {
    // revert if errors
    session.abortTransaction();
    console.log(err);

    const error = new Error('An error occured');
    error.statusCode = 500;
    return next(error);
  }
}
export const putPost = async (req, res, next) => {
  const { title, imageUrl, message } = req.body;
  const { id } = req.params;
  
  
  const isId =  mongoose.Types.ObjectId.isValid(id);
  if(!isId) {
    return next(new HttpException(404, 'Post not found'));
  }
  const errors = validationResult(req);

  if(!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Data validation failed',
      errors: errors.mapped(),
    });
  }

  try {
    const post = await Post.findById(id);
    if(!post) {
      return next(new HttpException(404, 'Post not found'));
    }

    const { user } = user;
    if(post.author.toString() !== user._id.toString()) {
      return next(new HttpException(403, 'Forbidden'));
    }

    const newPost = isDifferent(post, {
      title,
      imageUrl,
      message,
    });

    if(!newPost) {
      return next(new HttpException(400, 'Wrong values'));
    }
    await newPost.save();
    res.status(200).json({
      newPost,
    })

  } catch(err) {
    console.log(err);
    const error = new Error('An error occured');
    error.statusCode = 500;
    return next(error);
  }
}
export const deletePost = async (req, res, next) => {

  const { id } = req.params;

  const isId =  mongoose.Types.ObjectId.isValid(id);
  if(!isId) {
    return next(new HttpException(404, 'Post not found'));
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const post = await Post.findById(id);
    if(!post) {
      return next(new HttpException(404, 'Post not found'));
    }
    const user = req.user;
    if(post.author.toString() !== user._id.toString()) {
      return next(new HttpException(403, 'Forbidden'));
    }
    const userPosts = user.posts.filter(userPost => userPost.post.toString() !== post._id.toString());
    user.posts = userPosts;

    await user.save({ session });
    await post.remove({ session });

    session.commitTransaction();

    return res.status(204).json({});

  } catch(err) {
    session.abortTransaction();
    const error = new Error('An error occured');
    return next(error);
  }
}