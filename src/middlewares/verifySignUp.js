const db = require('../models');
const User = db.user;
const Role = db.Role;
const sequelize = require('sequelize');
const Op = sequelize.Op;
const _ = require('lodash');

class VerifySignUp {
    checkDuplicateUsernameOrEmail = async (req, res, next) => {
        // console.log('req ', req);
        const user = await User.findOne({
            where: {
                username: req.body.username,
            },
        });
        if (user) {
            res.status(400).send({
                message: 'Failed! Username is already in use!',
            });
            return;
        }

        // const newUser = await User.findOne({
        //     where: {
        //         email_id: req.body.emailId,
        //     },
        // });
        // if (newUser) {
        //     res.status(400).send({
        //         message: 'Failed! Email is already in use!',
        //     });
        //     return;
        // }
        //  req.enterpriseCode;
        next();
    };

    checkRolesExisted = async (req, res, next) => {
        console.log('req in role existed ', req.enterpriseCode);
        if (req.body.roles) {
            const roles = await Role.findAll({
                attributes: ['name'],
                where: {
                    [Op.and]: {
                        name: [req.body.roles],
                        enterprise_code: req.enterpriseCode,
                    },
                },
            });
            console.log('roles ', roles);
            const diffArray = await _.difference(req.body.roles, roles);
            if (diffArray.length === 0) {
                res.status(400).send({
                    message: 'Failed! Role does not exist = ' + diffArray,
                });
                return;
            }
        }
        //req.enterpriseCode;
        next();
    };
}

module.exports = VerifySignUp;
