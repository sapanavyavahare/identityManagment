const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');
const db = require('../models');
const User = db.user;

class AuthJwt {
    //token = '';
    verifyToken = async (req, res, next) => {
        console.log('request heraders', req.headers);
        let jwtToken = req.headers.authorization;
        let token;
        console.log('jwtToken ', jwtToken);
        if (jwtToken) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(403).send({
                message: 'No token provided!',
            });
        }
        //config.accessTokens.push(token);
        console.log('config access token ', config.accessTokens);
        // if (!config.accessTokens.includes(token)) {
        //     return res.status(403).send({
        //         message: 'Your token is expired .Please log in again',
        //     });
        // }
        jwt.verify(token, config.secret, async (err, decoded) => {
            if (err) {
                return res.status(401).send({
                    message: 'Unauthorized!',
                });
            }
            const user = await User.findByPk(decoded.id, {
                include: ['Roles'],
            });
            req.userId = decoded.id;
            req.user = user;
            req.token = token;
            return next();
        });
    };

    isAdmin = (req, res, next) => {
        User.findByPk(req.userId, {
            include: ['Roles'],
        }).then((user) => {
            // console.log('user ', user);

            // console.log('roles ', roles);
            for (let i = 0; i < req.user.Roles.length; i++) {
                if (user.Roles[i].name === 'Admin') {
                    req.enterpriseCode = user.enterprise_code;
                    next();
                    return;
                }
            }
            res.status(403).send({
                message: 'Require Admin Role!',
            });
            return;
        });
    };
    // logout = (req, res) => {
    //     let t;
    //     if (!req.token) {
    //         return res.status(401);
    //     }
    //     console.log(
    //         'access token array befor delete token ',
    //         config.accessTokens
    //     );
    //     if (config.accessTokens.includes(req.token)) {
    //         config.accessTokens = config.accessTokens.filter(
    //             (t) => t !== req.token
    //         );
    //         console.log(
    //             'access token array after delete token ',
    //             config.accessTokens
    //         );
    //         return res.send({
    //             statusCode: 200,
    //             message: 'successfully.logged.out.',
    //         });
    //     }
    // };
}

module.exports = AuthJwt;
