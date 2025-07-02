import { Request, Response, NextFunction } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { ERROR_MESSAGES, PASSWORD_MIN_LENGTH, USERNAME_MIN_LENGTH } from '../utils/constants';

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: ERROR_MESSAGES.VALIDATION_ERROR,
      errors: errors.array().map(error => ({
        field: (error as any).path || error.type,
        message: error.msg,
        value: (error as any).value
      }))
    });
    return;
  }
  
  next();
};

// Auth validation
export const validateRegister = [
  body('username')
    .isLength({ min: USERNAME_MIN_LENGTH })
    .withMessage(`El nombre de usuario debe tener al menos ${USERNAME_MIN_LENGTH} caracteres`)
    .isAlphanumeric()
    .withMessage('El nombre de usuario solo puede contener letras y números'),
  
  body('email')
    .isEmail()
    .withMessage('El email debe tener un formato válido')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: PASSWORD_MIN_LENGTH })
    .withMessage(`La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres`)
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('La contraseña debe contener al menos una mayúscula, una minúscula y un número'),
  
  body('role')
    .optional()
    .isIn(['admin', 'recruiter'])
    .withMessage('El rol debe ser admin o recruiter'),
  
  handleValidationErrors
];

export const validateLogin = [
  body('username')
    .notEmpty()
    .withMessage('El nombre de usuario es requerido'),
  
  body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida'),
  
  handleValidationErrors
];

// Candidate validation
export const validateCreateCandidate = [
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre debe tener entre 2 y 50 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('El nombre solo puede contener letras y espacios'),
  
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('El apellido debe tener entre 2 y 50 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('El apellido solo puede contener letras y espacios'),
  
  body('email')
    .isEmail()
    .withMessage('El email debe tener un formato válido')
    .normalizeEmail(),
  
  body('phone')
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('El teléfono debe tener un formato válido'),
  
  body('address')
    .trim()
    .isLength({ min: 10, max: 200 })
    .withMessage('La dirección debe tener entre 10 y 200 caracteres'),
  
  handleValidationErrors
];

export const validateUpdateCandidate = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('El ID del candidato debe ser un número entero positivo'),
  
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre debe tener entre 2 y 50 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('El nombre solo puede contener letras y espacios'),
  
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('El apellido debe tener entre 2 y 50 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('El apellido solo puede contener letras y espacios'),
  
  body('email')
    .optional()
    .isEmail()
    .withMessage('El email debe tener un formato válido')
    .normalizeEmail(),
  
  body('phone')
    .optional()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('El teléfono debe tener un formato válido'),
  
  body('address')
    .optional()
    .trim()
    .isLength({ min: 10, max: 200 })
    .withMessage('La dirección debe tener entre 10 y 200 caracteres'),
  
  handleValidationErrors
];

export const validateCandidateId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('El ID del candidato debe ser un número entero positivo'),
  
  handleValidationErrors
];

// Pagination validation
export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La página debe ser un número entero positivo'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('El límite debe ser un número entre 1 y 100'),
  
  handleValidationErrors
]; 