const joi = require('joi');

const enterpriseSchema = {
    enterprise: joi.object({
        name: joi.string().required(),
        admin: joi.object({
            emailId: joi.string().email().required(),
            name: joi.string().required(),
            username: joi.string().required(),
        }),
    }),

    id: joi.number().required(),

    role: joi.object({
        name: joi.string().required(),
        description: joi.string().required(),

        permissionId: joi.array().items(joi.number().required()).required(),
    }),

    user: joi.object({
        name: joi.string().required(),
        emailId: joi.string().email().required(),
        username: joi.string().required(),
        roles: joi.array().items(joi.string().required()),
    }),
    userPassword: joi.object({
        username: joi.string().required(),
        password: joi
            .string()
            .pattern(
                new RegExp(
                    '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,30})'
                )
            )
            .required(),
    }),

    passwordCheck: joi.object({
        newPassword: joi
            .string()
            .pattern(
                new RegExp(
                    '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,30})'
                )
            )
            .required(),
        confirmPassword: joi.string().valid(joi.ref('newPassword')).required(),
    }),

    changePassowrd: joi.object({
        username: joi.string().required(),
        password: joi
            .string()
            .pattern(
                new RegExp(
                    '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,30})'
                )
            )
            .required(),
        newPassword: joi
            .string()
            .pattern(
                new RegExp(
                    '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,30})'
                )
            )
            .required(),
        confirmPassword: joi.string().valid(joi.ref('newPassword')).required(),
    }),
};

module.exports = enterpriseSchema;
