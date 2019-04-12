/**
 * Npm import
 */
import { body } from 'express-validator/check';

/**
 * Local import
 */
export const dataValidation = () => {

  return [
    body('title').isLength({ min: 5}).withMessage('La taille minimale du titre est de 5 caractères'),
    body('message').isLength({ min: 5}).withMessage('La taille minimale du message est de 5 caractères'),
    body('imageUrl').isURL().withMessage('Ceci n\'est pas une URL valide')
  ];
};

export const editValidation = () => {
    return [      
      body('title').optional().isLength({ min: 5}).withMessage('La taille minimale du titre est de 5 caractères'),
      body('message').optional().isLength({ min: 5}).withMessage('La taille minimale du message est de 5 caractères'),
      body('imageUrl').optional().isURL().withMessage('Ceci n\'est pas une URL valide')
    ]
  }