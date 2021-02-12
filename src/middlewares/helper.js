const crypto = require('crypto');

class AuthService {
    constructor() {}
    async getRandomString(length) {
        return await crypto
            .randomBytes(Math.ceil(length / 2))
            .toString('hex') /** convert to hexadecimal format */
            .slice(0, length);
    }
    async sha512(password, salt) {
        var hash = crypto.createHmac(
            'sha512',
            salt
        ); /** Hashing algorithm sha512 */
        hash.update(password);
        var value = hash.digest('hex');
        return {
            salt: salt,
            passwordHash: value,
        };
    }
    async saltHashPassword(userPassword) {
        var salt = await this.getRandomString(16);
        var passwordData = await this.sha512(userPassword, salt);
        console.log('UserPassword = ', userPassword);
        console.log('Passwordhash = ', passwordData.passwordHash);
        console.log('nSalt = ' + passwordData.salt);
        return passwordData;
    }
}
module.exports = AuthService;
