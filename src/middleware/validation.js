import joi from 'joi';

// Define the updated schema
const userSchema = joi.object({
    name: joi.string().min(3).max(30).required(),
    email: joi.string().email().required(),
    // Added password validation
    password: joi.string()
        .min(8)
        .max(30)
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$'))
        .required()
        .messages({
            'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number.',
            'string.min': 'Password must be at least 8 characters long.',
            'any.required': 'Password is a required field.'
        })
});

const validateUser = (req, res, next) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
        // Return a clean error message to the client
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
}

export default validateUser;