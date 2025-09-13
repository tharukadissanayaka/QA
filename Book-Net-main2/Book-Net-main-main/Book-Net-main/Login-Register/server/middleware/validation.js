const { body, param, query, validationResult } = require('express-validator');

// Common validation rules
const validateBook = [
    body('title').notEmpty().trim().escape().withMessage('Title is required and must be valid text'),
    body('author').notEmpty().trim().escape().withMessage('Author is required'),
    body('price').isNumeric().withMessage('Price must be a number'),
    body('category').notEmpty().trim().escape().withMessage('Category is required'),
    body('image').isURL().withMessage('Image must be a valid URL')
];

const validateUser = [
    body('name').notEmpty().trim().escape().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const validateEmailParam = [
    param('email').isEmail().normalizeEmail().withMessage('Valid email parameter is required')
];

const validateObjectId = [
    param('id').isMongoId().withMessage('Valid MongoDB ID is required')
];

const validateCartItem = [
    body('bookname').notEmpty().trim().escape(),
    body('email').isEmail().normalizeEmail(),
    body('price').isNumeric(),
    body('quantity').isInt({ min: 1 }),
    body('image').isURL()
];

// Validation result handler
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = {
    validateBook,
    validateUser,
    validateEmailParam,
    validateObjectId,
    validateCartItem,
    handleValidationErrors
};