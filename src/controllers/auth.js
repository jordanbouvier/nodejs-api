/**
 * Npm import
 */

import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator/check';
import bcrypt from 'bcryptjs';

/**
 * Local import
 */
import User from '../models/user';
import CONFIG from '../config/config';
import { HttpException } from '../utils/errors';

export const postRegister = async (req, res, next) => {

  const { username, password, email} = req.body;
  const errors = validationResult(req);
  console.log(errors.mapped());

  if(!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.mapped(),
    })
  }  

  try {
    const hashPassword = await bcrypt.hash(password, 12);    

    const user = new User({
      username,
      password: hashPassword,
      email,
    });
    await user.save();
    res.status(201).json();

  } catch(err) {
    const error = new Error('Something went wrong');
    error.statusCode = 500;
    next(error);
  }

}

export const postLogin = async (req, res, next) => {
  
  const { username, password } = req.body;
  const errors = validationResult(req);

  if(!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Data validation failed',
      errors: errors.mapped()
    });
  }
  
  try {
    const user = await User.findOne({
      username
    });

    if(!user) {
      return next(new HttpException(404, 'User not found'));
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if(!passwordMatch) {
      return next(new HttpException(404, 'User not found'));
    }

    const token = jwt.sign({
      userId: user._id      
    }, {key: CONFIG.jwt_private_key, passphrase: CONFIG.jwt_key_passphrase },
      { algorithm: 'RS256', expiresIn: '1h'}
    );

    res.status(200).json({
      userId: user._id,
      token,    
  })  
   
  } catch (err) {
    console.log(err);
  }
}
