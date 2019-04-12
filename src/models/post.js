/**
 * Npm import
 */

import mongoose, { Schema } from 'mongoose';
import { body } from 'express-validator/check';

/**
 * Schema
 */
const postSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String, 
    required: true,
  },
  message: {
    type: String,
    required: true,
  }, 
  author: {
      type: Schema.Types.ObjectId,
      ref: 'User',   
  }

}, { timestamps: true });

/**
 * Export
 */
export default mongoose.model('Post', postSchema);