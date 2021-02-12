const {
    enterprise,
    role,
    id,
    user,
    passowordPolicy,
    userPassword,
    changePassowrd,
    passwordCheck,
} = require('./enterprise.schema');

class EnterpriseValidation {
    async createEnterpriseValidation(req, res, next) {
        const value = await enterprise.validate(req.body);
        console.log('value ', value);
        if (value.error) {
            res.status(422).json({
                statusCode: 422,
                message: value.error.details[0].message,
            });
        } else {
            next();
        }
    }

    async createRoleValidation(req, res, next) {
        const value = await role.validate(req.body);
        console.log('value ', value);
        if (value.error) {
            res.status(422).json({
                statusCode: 422,
                message: value.error.details[0].message,
            });
        } else {
            next();
        }
    }

    async paramsIdValidation(req, res, next) {
        const value = await id.validate(req.params.id);
        console.log('value ', value);
        if (value.error) {
            return res.status(422).json({
                statusCode: 422,
                message: value.error.details[0].message,
            });
        } else {
            next();
        }
    }

    async createUserValidation(req, res, next) {
        const value = await user.validate(req.body);
        console.log('value ', value);
        if (value.error) {
            res.status(422).json({
                statusCode: 422,
                message: value.error.details[0].message,
            });
        } else {
            next();
        }
    }
    async userPasswordValidation(req, res, next) {
        const value = await userPassword.validate(req.body);
        console.log('value ', value);
        if (value.error) {
            res.status(422).json({
                statusCode: 422,
                message: value.error.details[0].message,
            });
        } else {
            next();
        }
    }

    async userActivateValidation(req, res, next) {
        const value = await passwordCheck.validate(req.body);
        console.log('value ', value);
        if (value.error) {
            res.status(422).json({
                statusCode: 422,
                message: value.error.details[0].message,
            });
        } else {
            next();
        }
    }

    async changePassowrdValidation(req, res, next) {
        const value = await changePassowrd.validate(req.body);
        console.log('value ', value);
        if (value.error) {
            res.status(422).json({
                statusCode: 422,
                message: value.error.details[0].message,
            });
        } else {
            next();
        }
    }
}

module.exports = EnterpriseValidation;
