/**
 * Npm import
 */
import { body } from 'express-validator/check';

/**
 * Local import
 */
import User from '../user';

export const creationValidation = () => {

  return [
    body('username').isLength({ min: 4 }),
    body('password').isLength({ min: 6}).withMessage('Le mot de passe doit faire 6 caractères minimum'),
    body('email').isEmail().withMessage('L\'adresse e-mail n\'est pas valide'),
    body('email').custom(async (value) => {
      try {
        const user = await User.findOne({
          email: value,
        })          
        if(user) {
          return Promise.reject('L\'email est déjà utilisé')
        }
      } catch(e) {
        
      }     

    }).withMessage('L\'email est déjà utilisé'),
    body('username').custom(async (value) => {
      try {
        const user = await User.findOne({
          username: value,
        })          
        if(user) {
          return Promise.reject('Le nom d\'utilisateur est déjà utilisé')
        }
      } catch(e) {
        
      }     

    }).withMessage('Le nom d\'utilisateur est déjà utilisé'),
  ];
};

