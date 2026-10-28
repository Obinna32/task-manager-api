const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../src/app");
const User = require("../src/models/User");
const expectCookies = require("supertest/lib/cookies");

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

afterEach(async() => {
    await User.deleteMany();
});

describe('Auth Endpoints', () => {
    const testUser = {
        name: 'Obinna Ekwealor',
        email: "obinna@example.com",
        password: "obinna123"
    };

    test('POST /api/v1/auth/register - should register a new user', async () => {
        const res = await request(app).post('/api/v1/auth/register').send(testUser);

        expect(res.statusCode).toEqual(201);
        expect(res.body.status).toEqual('success');
        expect(res.body.token).toBeDefined();
        expect(res.body.data.user.email).toEqual(testUser.email);
        expect(res.body.data.user.password).toBeUndefined();
    });

    test('POST /api/v1/auth/register - should fail on duplicate email(409)', async() => {
        await User.create(testUser);

        const res = await request(app).post('/api/v1/auth/register').send(testUser);

        expect(res.statusCode).toEqual(409);
        expect(res.body.status).toEqual('fail');
    });

    test('POST /api/v1/auth/login - should log in an existing user', async () => {
        await User.create(testUser);

        const res = await request(app).post('/api/v1/auth/login').send({ email: testUser.email, password: testUser.password});

        expect(res.statusCode).toEqual(200);
        expect(res.body.status).toEqual('success');
        expect(res.body.token).toBeDefined();
    });

    test('POST /api/v1/auth/login - should fail with wrong password(401)', async() => {
        await User.create(testUser);

        const res = await request(app).post('/api/v1/auth/login').send({ email: testUser.email, password: 'wrongpassword'});

        expect(res.statusCode).toEqual(401);
        expect(res.body.status).toEqual('fail')
    })
})