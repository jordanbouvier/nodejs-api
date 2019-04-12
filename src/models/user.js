/**
 * Npm iport
 */
import mongoose, { Schema } from 'mongoose';
import { body } from 'express-validator/check';


const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  posts: [
    {
      post: Schema.Types.ObjectId
    }
  ],

}, { timestamps: true});

class UserClass 
{
  static creationValidation() {
    return [
      body('username').isLength({ min: 4 }),
      body('password').isLength({ min: 6}).withMessage('Le mot de passe doit faire 6 caractères minimum'),
      body('email').isEmail().withMessage('L\'adresse e-mail n\'est pas valide')
    ];
  }
  static editValidation() {

  }
  static signInValidation() {
    return [
      body('username').not().isEmpty(),
      body('password').not().isEmpty(),
    ]
  }
}
userSchema.loadClass(UserClass);

export default mongoose.model('User', userSchema);