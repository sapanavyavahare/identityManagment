const { before, iteratee } = require('lodash');
const supertest = require('supertest');
const app = require('../src/app')();

describe('user authenticate and password related endpoints ', () => {
    var token = '';
    beforeAll(async () => {
        console.log('before test case password test js ');
    });

    it('should activate user by token using valid activation key ', async () => {
        const res = await supertest(app)
            .post('/idm/api/users/activation/d27ccf3e93f20b1789b3')
            .send({
                newPassword: 'S@pana12',
                confirmPassword: 'S@pana12',
            });
        expect(res.statusCode).toEqual(200);
    });

    it('should get salt for valid user ', async () => {
        const res = await supertest(app).post('/idm/api/salt').send({
            username: 'accentureBranch-admin',
        });
        expect(res.statusCode).toEqual(200);
    });

    it('should create activation key for forgot password ', async () => {
        const res = await supertest(app)
            .post('/idm/api/users/forgotpassword')
            .send({
                username: 'accentureBranch-admin',
            });
        expect(res.statusCode).toEqual(200);
    });
});
