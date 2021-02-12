const { iteratee } = require('lodash');
const supertest = require('supertest');
const app = require('../src/app')();

describe('should test all validation schemas for all endpoints ', () => {
    beforeAll(async () => {
        console.log('befor validation schema testing ');
    });

    it('should not authorize api for create root enterprise req body validation for invalid name', async () => {
        const res = await supertest(app)
            .post('/idm/api/enterprises/root')
            .send({
                name: '',
                admin: {
                    emailId: 'abc@gmail.com',
                    name: 'abc',
                    username: 'abc-admin',
                },
            });
        expect(res.statusCode).toEqual(422);
    });

    it('should not authorize api for create root enterprise req body validation for invalid emailId', async () => {
        const res = await supertest(app)
            .post('/idm/api/enterprises/root')
            .send({
                name: 'shhsdhd',
                admin: {
                    emailId: 'abcgmail.com',
                    name: 'abc',
                    username: 'abc-admin',
                },
            });
        expect(res.statusCode).toEqual(422);
    });

    it('should not authorize api for create root enterprise req body validation for invalid admin.name', async () => {
        const res = await supertest(app)
            .post('/idm/api/enterprises/root')
            .send({
                name: '',
                admin: {
                    emailId: 'abc@gmail.com',
                    name: '',
                    username: 'abc-admin',
                },
            });
        expect(res.statusCode).toEqual(422);
    });

    it('should not authorize api for create root enterprise req body validation for invalid admin.username', async () => {
        const res = await supertest(app)
            .post('/idm/api/enterprises/root')
            .send({
                name: '',
                admin: {
                    emailId: 'abc@gmail.com',
                    name: 'abc',
                    username: '',
                },
            });
        expect(res.statusCode).toEqual(422);
    });

    it('should not activate user by using invalid newPassword ', async () => {
        const res = await supertest(app)
            .post('/idm/api/users/activation/d27ccf3e93f20b1789b3')
            .send({
                newPassword: '',
                confirmPassword: '',
            });
        expect(res.statusCode).toEqual(422);
    });

    it('should not activate user by using invalid confirmPassword ', async () => {
        const res = await supertest(app)
            .post('/idm/api/users/activation/d27ccf3e93f20b1789b3')
            .send({
                newPassword: 'S@pana12',
                confirmPassword: '',
            });
        expect(res.statusCode).toEqual(422);
    });

    it('should not activate user by using invalid newPassword ', async () => {
        const res = await supertest(app)
            .post('/idm/api/users/activation/d27ccf3e93f20b1789b3')
            .send({
                newPassword: 'S@p',
                confirmPassword: '',
            });
        expect(res.statusCode).toEqual(422);
    });

    it('should not authenticate user by using invalid username', async () => {
        const res = await supertest(app).post('/idm/api/auth').send({
            username: '',
            password: 'S@pana12',
        });
        expect(res.statusCode).toEqual(422);
    });

    it('should not authenticate user by using invalid password', async () => {
        const res = await supertest(app).post('/idm/api/auth').send({
            username: 'sapana',
            password: 'S@p',
        });
        expect(res.statusCode).toEqual(422);
    });

    it('should not authenticate user by using invalid password', async () => {
        const res = await supertest(app).post('/idm/api/auth').send({
            username: 'sapana',
            password: '',
        });
        expect(res.statusCode).toEqual(422);
    });
});
