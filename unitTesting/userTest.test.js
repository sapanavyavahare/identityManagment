const supertest = require('supertest');
const app = require('../src/app')();

describe('user and enterprise related endpoints ', () => {
    var token = '';
    beforeAll(async () => {
        console.log('before user test case ');
        const result = await supertest(app).post('/idm/api/auth').send({
            username: 'acccenture-admin',
            password: 'S@pana12',
        });
        //console.log('token result ', JSON.parse(result.text));
        var jwtToken = JSON.parse(result.text);
        console.log('token result ', jwtToken);
        token = jwtToken.token;
    });

    //all create endpoints test cases
    it('should create a new role with permission', async () => {
        const res = await supertest(app)
            .post('/idm/api/roles')
            .set('authorization', 'Bearer ' + token)
            .send({
                name: 'engNew9',
                description: 'ddbjdbf',
                permissionId: [1, 2, 4],
            });
        // console.log('res', res.body);
        expect(res.statusCode).toEqual(200);
    });

    it('should create user with valid token ', async () => {
        const res = await supertest(app)
            .post('/idm/api/users')
            .set('authorization', 'Bearer ' + token)
            .send({
                name: 'swarnima',
                username: 'swarnima-ORG',
                emailId: 'sapana12.v@gmail.com',
                roles: ['DPO'],
            });
        expect(res.statusCode).toEqual(200);
    });

    it('should create root enterprise ', async () => {
        const res = await supertest(app)
            .post('/idm/api/enterprises/root')
            .send({
                name: 'Infosis7',
                admin: {
                    emailId: 'sapana12.v@gmail.com',
                    name: 'Infosis7',
                    username: 'Infosis7-admin',
                },
            });
        expect(res.statusCode).toEqual(200);
    });

    it('should create password policy ', async () => {
        const res = await supertest(app)
            .post('/idm/api/passwordpolicies')
            .set('authorization', 'Bearer ' + token)
            .send({
                policyName: 'TCS Policy11',
                description: 'Admin User',
                minPasswordLength: 8,
                minLowerAlphaChars: 3,
                minUpperAlphaChars: 2,
                minNumericalChars: 1,
                minSpecialChars: 1,
            });
        expect(res.statusCode).toEqual(200);
    });

    //all get endpoints test cases
    it('should get all permissions', async () => {
        const res = await supertest(app)
            .get('/idm/api/permissions')
            .set('authorization', 'Bearer ' + token);
        // console.log('res', res.text);
        expect(res.statusCode).toEqual(200);
    });

    it('should get perticular permissions for specific feature', async () => {
        const res = await supertest(app)
            .get('/idm/api/permissions/search?feature=user')
            .set('authorization', 'Bearer ' + token);
        //  console.log('res', res.text);
        expect(res.statusCode).toEqual(200);
    });
    it('should get all roles', async () => {
        const res = await supertest(app)
            .get('/idm/api/roles')
            .set('authorization', 'Bearer ' + token);
        // console.log('res', res.text);
        expect(res.statusCode).toEqual(200);
    });
    it('should get perticular role by role id', async () => {
        const res = await supertest(app)
            .get('/idm/api/roles/13')
            .set('authorization', 'Bearer ' + token);
        // console.log('res', res.text);
        expect(res.statusCode).toEqual(200);
    });
    it('should delete perticular role', async () => {
        const res = await supertest(app)
            .delete('/idm/api/roles/13')
            .set('authorization', 'Bearer ' + token);
        //console.log('res', res.body);
        expect(res.statusCode).toEqual(200);
    });
    it('should update role ', async () => {
        const res = await supertest(app)
            .put('/idm/api/roles/13')
            .set('authorization', 'Bearer ' + token)
            .send({
                name: 'BA Entities Role',
                description: 'Roles for CRUD Operations',
                permissionId: [1, 2, 3, 4],
            });
    });

    //get all user list
    it('should list all users ', async () => {
        const res = await supertest(app)
            .get('/idm/api/users/list')
            .set('authorization', 'Bearer ' + token);

        expect(res.statusCode).toEqual(200);
    });

    //get enterprise details
    it('should get enterprise details  ', async () => {
        const res = await supertest(app)
            .get('/idm/api/enterprises')
            .set('authorization', 'Bearer ' + token);
        expect(res.statusCode).toEqual(200);
    });

    it('should suspend enterprise ', async () => {
        const res = await supertest(app).put('/idm/api/enterprises/1/suspend');
        expect(res.statusCode).toEqual(200);
    });

    it('should activate enterprise ', async () => {
        const res = await supertest(app).put('/idm/api/enterprises/1/activate');
        expect(res.statusCode).toEqual(200);
    });

    it('should delete enterprise ', async () => {
        const res = await supertest(app).delete(
            '/idm/api/enterprises/1/delete'
        );
        expect(res.statusCode).toEqual(200);
    });

    it('should not create user without token or invalid token ', async () => {
        const res = await supertest(app)
            .post('/idm/api/users')
            .set('authorization', 'Bearer ')
            .send({
                name: 'HMT',
                username: 'HMT-ORG',
                emailId: 'sapana12.v@gmail.com',
                enterpriseCode: '79622596-fc6a-4048-b0b6-ae40388fef8f',
                roles: ['ADMIN', 'DPO'],
            });
    });

    it('should suspend user ', async () => {
        const res = await supertest(app)
            .put('/idm/api/users/suspend/1')
            .set('authorization', 'Bearer ' + token);

        expect(res.statusCode).toEqual(200);
    });

    it('should activate user ', async () => {
        const res = await supertest(app)
            .put('/idm/api/users/activate/1')
            .set('authorization', 'Bearer ' + token);

        expect(res.statusCode).toEqual(200);
    });

    it('should delete user ', async () => {
        const res = await supertest(app)
            .delete('/idm/api/users/1')
            .set('authorization', 'Bearer ' + token);

        expect(res.statusCode).toEqual(200);
    });

    it('should fetch password policies ', async () => {
        const res = await supertest(app)
            .get('/idm/api/passwordpolicies')
            .set('authorization', 'Bearer ' + token);
        expect(res.statusCode).toEqual(200);
    });

    it('should update password policies ', async () => {
        const res = await supertest(app)
            .put('/idm/api/passwordpolicies')
            .set('authorization', 'Bearer ' + token)
            .send({
                policyName: 'Default Policy2',
                description: 'Admin User',
                minPasswordLength: 8,
                minLowerAlphaChars: 3,
            });
        expect(res.statusCode).toEqual(200);
    });

    it('should activate password policy ', async () => {
        const res = await supertest(app)
            .put('/idm/api/passwordpolicies/1/activate')
            .set('authorization', 'Bearer ' + token);
        expect(res.statusCode).toEqual(200);
    });

    it('should deactivate password policy ', async () => {
        const res = await supertest(app)
            .put('/idm/api/passwordpolicies/1/deactivate')
            .set('authorization', 'Bearer ' + token);
        expect(res.statusCode).toEqual(200);
    });

    it('should delete password policy ', async () => {
        const res = await supertest(app)
            .delete('/idm/api/passwordpolicies/1')
            .set('authorization', 'Bearer ' + token);
        expect(res.statusCode).toEqual(200);
    });

    it('should not change password ', async () => {
        const res = await supertest(app)
            .put('/idm/api/users/passwd/change')
            .set('authorization', 'Bearer ' + token)
            .send({
                username: 'parag-ORG',
                password: 'S@pana12',
                newPassword: 'Parag@12',
                confirmPassword: 'Parag@12',
            });
        expect(res.statusCode).toEqual(500);
    });
    //request body authorization related test cases
    it('should not authorize api for create user by id req body validation for invalid name ', async () => {
        const res = await supertest(app)
            .post('/idm/api/users')
            .set('authorization', 'Bearer ' + token)
            .send({
                name: '',
                username: 'sdsdf',
                emailId: 'abc@gmail.com',
                roles: ['Admin'],
            });
        expect(res.statusCode).toEqual(422);
    });

    it('should not authorize api for create user by id req body validation for invalid username ', async () => {
        const res = await supertest(app)
            .post('/idm/api/users')
            .set('authorization', 'Bearer ' + token)
            .send({
                name: 'abc',
                username: '',
                emailId: 'abc@gmail.com',
                roles: ['Admin'],
            });
        expect(res.statusCode).toEqual(422);
    });

    it('should not authorize api for create user by id req body validation for invalid emailId ', async () => {
        const res = await supertest(app)
            .post('/idm/api/users')
            .set('authorization', 'Bearer ' + token)
            .send({
                name: 'abc',
                username: 'sdsdf',
                emailId: 'abcgmail.com',
                roles: ['Admin'],
            });
        expect(res.statusCode).toEqual(422);
    });

    it('should not authorize api for create role req body validation for invalid name', async () => {
        const res = await supertest(app)
            .post('/idm/api/roles')
            .set('authorization', 'Bearer ' + token)
            .send({
                name: '',
                description: 'sddfdsf',
                permissionId: [1, 2, 3],
            });
        expect(res.statusCode).toEqual(422);
    });

    it('should not authorize api for create role req body validation for invalid description', async () => {
        const res = await supertest(app)
            .post('/idm/api/roles')
            .set('authorization', 'Bearer ' + token)
            .send({
                name: 'dfdf',
                description: '',
                permissionId: [1, 2, 3],
            });
        expect(res.statusCode).toEqual(422);
    });

    it('should not authorize api for create role req body validation for invalid permissionId', async () => {
        const res = await supertest(app)
            .post('/idm/api/roles')
            .set('authorization', 'Bearer ' + token)
            .send({
                name: '',
                description: 'sddfdsf',
                permissionId: [],
            });
        expect(res.statusCode).toEqual(422);
    });
    it('should not authorize api for update role req body validation for invalid role id ', async () => {
        const res = await supertest(app)
            .put('/idm/api/roles')
            .set('authorization', 'Bearer ' + token);

        expect(res.statusCode).toEqual(404);
    });
    it('should not authorize api for update role req body validation for invalid name', async () => {
        const res = await supertest(app)
            .put('/idm/api/roles/5')
            .set('authorization', 'Bearer ' + token)
            .send({
                name: '',
                description: 'sddfdsf',
                permissionId: [1, 2, 3],
            });
        expect(res.statusCode).toEqual(422);
    });

    it('should not authorize api for update role req body validation for invalid description', async () => {
        const res = await supertest(app)
            .put('/idm/api/roles/5')
            .set('authorization', 'Bearer ' + token)
            .send({
                name: 'fgf',
                description: '',
                permissionId: [1, 2, 3],
            });
        expect(res.statusCode).toEqual(422);
    });

    it('should not authorize api for update role req body validation for invalid permissionId', async () => {
        const res = await supertest(app)
            .put('/idm/api/roles/5')
            .set('authorization', 'Bearer ' + token)
            .send({
                name: 'dvd',
                description: 'sddfdsf',
                permissionId: [],
            });
        expect(res.statusCode).toEqual(422);
    });

    it('should not change password with invalid username ', async () => {
        const res = await supertest(app)
            .put('/idm/api/users/passwd/change')
            .set('authorization', 'Bearer ' + token)
            .send({
                username: '',
                password: 'S@pana12',
                newPassword: 'Parag@12',
                confirmPassword: 'Parag@12',
            });
        expect(res.statusCode).toEqual(422);
    });

    it('should not change password with invalid password ', async () => {
        const res = await supertest(app)
            .put('/idm/api/users/passwd/change')
            .set('authorization', 'Bearer ' + token)
            .send({
                username: 'sapana',
                password: 'S@p',
                newPassword: 'Parag@12',
                confirmPassword: 'Parag@12',
            });
        expect(res.statusCode).toEqual(422);
    });

    it('should not change password with invalid password', async () => {
        const res = await supertest(app)
            .put('/idm/api/users/passwd/change')
            .set('authorization', 'Bearer ' + token)
            .send({
                username: 'sapana',
                password: '',
                newPassword: 'Parag@12',
                confirmPassword: 'Parag@12',
            });
        expect(res.statusCode).toEqual(422);
    });

    it('should not change password with invalid newPassword', async () => {
        const res = await supertest(app)
            .put('/idm/api/users/passwd/change')
            .set('authorization', 'Bearer ' + token)
            .send({
                username: 'sapana',
                password: 'S@pana12',
                newPassword: '',
                confirmPassword: 'Parag@12',
            });
        expect(res.statusCode).toEqual(422);
    });

    it('should not change password with invalid newPassword', async () => {
        const res = await supertest(app)
            .put('/idm/api/users/passwd/change')
            .set('authorization', 'Bearer ' + token)
            .send({
                username: 'sapana',
                password: 'S@pana12',
                newPassword: 'Par',
                confirmPassword: 'Parag@12',
            });
        expect(res.statusCode).toEqual(422);
    });
});
