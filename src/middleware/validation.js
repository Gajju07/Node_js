import jio from 'joi';

const userSchema = jio.object({
        name: jio.string().min(3).max(30).required(),
        email: jio.string().email().required()
    });


const validateUser = (req, res, next) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
}

export default validateUser;
