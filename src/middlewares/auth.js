/**
 * Node import
 */
import fs from 'fs';
import path from 'path';


/**
 * Npm import
 */

import jwt, { TokenExpiredError } from 'jsonwebtoken';


/**
 * Local import
 */
import User from '../models/user';
import CONFIG from '../config/config';
import { HttpException } from '../utils/errors';

export const isAuth = (req, res, next) => {

  if(!req.user || !req.user._id || !req.token || !req.token.exp) {
    const error = new HttpException(401, 'Unauthorized');
    throw error;
  }

  const currentTime = new Date().getTime() / 1000;
  const tokenTime = req.token.exp;
  if(currentTime > tokenTime) {
    const error = new HttpException(401, 'Token expired');
    throw error;
  }

  next();
}

export const getDecodedToken = (req) => {
  
  const authHeader = req.get('Authorization');
  if(!authHeader) {
    return false;
  }

  const headerParts = authHeader.split(' ');
  
  if(!headerParts[1]) {
    return false;
  }

  const token = headerParts[1];

  if(!token) {
    return false;
  }
  
  try {
    const decodedToken = jwt.verify(token, CONFIG.jwt_public_key, { algorithms: 'RS256'}, (err, decoded) => {
        if(err) {
          return false;
        }
        return decoded;
    }); 
    if(!decodedToken || !decodedToken.userId ) {
      return false;
    }
    return decodedToken;

  } catch(e) {   
    console.log(e);
  }
}

export const getUser = async (req, res, next) => {
  
  const token = getDecodedToken(req);
  if(!token) {
    return next();
  }

  try {
    const user = await User.findById(token.userId);
    if (!user) {
      return next();
    }    
    req.user = user;
    req.token = token;
  } catch (e) {
    console.log(e);
  }
  return next();
};

// Possible gestion de rôles

export const hasRole = roleName => ((req, res, next) => {
    const user = req.user;
    if(user && user.roles) {
      if(Array.isArray(user.roles)) {
        if(user.roles.includes(roleName)) {
          return next();
        }
      }
    }
    const error = new HttpException(403, 'Forbidden');
    return next(error);  
  }
);
