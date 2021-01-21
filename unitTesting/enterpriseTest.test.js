const supertest = require('supertest');
const app = require('../src/app')();

describe('Post Endpoints', () => {
    beforeAll(async () => {
        console.log('testing test');
    });

    it('should get all permissions', async () => {
        const res = await supertest(app).get('/idm/api/permissions');
        // console.log('res', res.text);
        expect(res.statusCode).toEqual(200);
    });

    it('should create a new role with permission', async () => {
        const res = await supertest(app)
            .post('/idm/api/roles')
            .send({
                name: 'hij',
                description: 'ddbjdbf',
                enterpriseCode: 'xxxxx',
                permissionId: [1, 2],
            });

        // console.log('res', res.body);
        expect(res.statusCode).toEqual(200);
    });

    it('should update  a  role', async () => {
        const res = await supertest(app)
            .put('/idm/api/roles/3')
            .send({
                name: 'fhhh',
                description: 'ddbjdbf',
                enterpriseCode: 'xxxxx',
                permissionId: [2, 5],
            });
        // console.log('res', res.body);
        expect(res.statusCode).toEqual(200);
    });

    it('should get perticular permissions for specific feature', async () => {
        const res = await supertest(app).get(
            '/idm/api/permissions/search?feature=user'
        );
        //  console.log('res', res.text);
        expect(res.statusCode).toEqual(200);
    });

    it('should get all roles', async () => {
        const res = await supertest(app).get('/idm/api/roles');
        // console.log('res', res.text);
        expect(res.statusCode).toEqual(200);
    });

    it('should get perticular role by role id', async () => {
        const res = await supertest(app).get('/idm/api/roles/3');
        // console.log('res', res.text);
        expect(res.statusCode).toEqual(200);
    });

    it('should delete perticular role', async () => {
        const res = await supertest(app).delete('/idm/api/roles/3');
        //console.log('res', res.body);
        expect(res.statusCode).toEqual(200);
    });

    afterAll((done) => {
        done();
    });
});
