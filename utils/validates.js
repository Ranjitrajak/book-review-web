const { body, param, query } = require('express-validator');

const authValidation = {
  signup: [
    body('username')
      .trim()
      .isLength({ min: 3, max: 30 })
      .withMessage('Username must be between 3 and 30 characters')
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage('Username can only contain letters, numbers, and underscores'),
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
  ],
  login: [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ]
};

const bookValidation = {
  create: [
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Title is required')
      .isLength({ max: 200 })
      .withMessage('Title cannot exceed 200 characters'),
    body('author')
      .trim()
      .notEmpty()
      .withMessage('Author is required')
      .isLength({ max: 100 })
      .withMessage('Author name cannot exceed 100 characters'),
    body('genre')
      .trim()
      .notEmpty()
      .withMessage('Genre is required')
      .isLength({ max: 50 })
      .withMessage('Genre cannot exceed 50 characters'),
    body('description')
      .trim()
      .notEmpty()
      .withMessage('Description is required')
      .isLength({ max: 1000 })
      .withMessage('Description cannot exceed 1000 characters'),
    body('publishYear')
      .isInt({ min: 1000, max: new Date().getFullYear() })
      .withMessage('Please provide a valid publish year'),
    body('isbn')
      .optional()
      .matches(/^(?:\d{13}|\d{10})$/)
      .withMessage('Invalid ISBN format')
  ]
};

const reviewValidation = {
  create: [
    param('id').isMongoId().withMessage('Invalid book ID'),
    body('rating')
      .isInt({ min: 1, max: 5 })
      .withMessage('Rating must be between 1 and 5'),
    body('comment')
      .trim()
      .notEmpty()
      .withMessage('Review comment is required')
      .isLength({ max: 500 })
      .withMessage('Review cannot exceed 500 characters')
  ],
  update: [
    param('id').isMongoId().withMessage('Invalid review ID'),
    body('rating')
      .optional()
      .isInt({ min: 1, max: 5 })
      .withMessage('Rating must be between 1 and 5'),
    body('comment')
      .optional()
      .trim()
      .isLength({ min: 1, max: 500 })
      .withMessage('Review comment must be between 1 and 500 characters')
  ]
};

const paginationValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
];

module.exports = {
  authValidation,
  bookValidation,
  reviewValidation,
  paginationValidation
};