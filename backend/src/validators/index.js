const Joi = require('joi');

const userProfileSchema = Joi.object({
    name: Joi.string().required(),
    age: Joi.number().integer().min(18).max(120).required(),
    language: Joi.string().valid('en', 'hi', 'te', 'ta', 'kn', 'ml').required(),
    location: Joi.string().required(),
    interests: Joi.array().items(Joi.string()),
    isFirstTimeVoter: Joi.boolean()
});

const chatRequestSchema = Joi.object({
    message: Joi.string().min(1).max(1000).required(),
    history: Joi.array().items(
        Joi.object({
            role: Joi.string().valid('user', 'assistant', 'system').required(),
            content: Joi.string().required()
        })
    )
});

module.exports = {
    userProfileSchema,
    chatRequestSchema
};
