const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../src/app");
const User = require("../src/models/User");
const Task = require("../src/models/Task")

let mongoServer;
let token1;
let token2;
let user1Id;

beforeAll(async() => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
});

afterAll(async() => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

beforeEach(async () => {
    await User.deleteMany();
    await Task.deleteMany();

    const res1 = await request(app).post('/api/v1/auth/register').send({ name: 'User One', email: 'user1@example.com', password: 'password123'})
    token1 = res1.body.token;
    user1Id = res1.body.data.user._id;

    const res2 = await request(app).post('/api/v1/auth/register').send({ name: "User Two", email: "user2@example.com", password: "password123"})
    token2 = res2.body.token;
});

describe('Task Endpoints', () => {
    test("POST /api/v1/tasks - should create a new task", async() => {
        const res = (await request(app).post('/api/v1/tasks')).setEncoding('Authorization', `Bearer ${token1}`).send({ title: 'Test Task 1', priority: 'high', tags: ['work']});

        expect(res.statusCode).toEqual(201);
        expect(res.body.status).toEqual('success');
        expect(res.body.data.task.title).toEqual('Test Task 1');
        expect(res.body.data.task.owner).toEqual(user1Id);
    });

    test('GET /api/v1/tasks - should list tasks for authenticated owner only', async() => {
        await Task.create({ title: 'Task User 1', owner: user1Id});

        const res = await request(app).get('/api/v1/tasks').set('Authorization', `Bearer ${token1}`)

        expect(res.statusCode).toEqual(200);
        expect(res.body.results).toEqual(1);
        expect(res.body.data.tasks[0].title).toEqual('Task User 1');

        const res2 = await request(app).get('/api/v1/tasks').set('Authorization', `Bearer ${token2}`);

        expect(res2.statusCode).toEqual(200);
        expect(res2.body.results).toEqual(0);
    });

    test('GET /api/v1/tasks/:id - should not allow access to another user task (404)', async() => {
        const task = await Task.create({ title: 'User 1 Task', owner: user1Id});

        const res = await request(app).get(`/api/v1/tasks/${task._id}`).set('Authorization', `Bearer ${token2}`);

        expect(res.statusCode).toEqual(404);
    });

    test('PATCH /api/v1/tasks/:id - should update status and set completedAt', async() => {
        const task = await Task.create({ title: 'Task to Complete', owner: user1Id});

        const res = await request(app).patch(`/api/v1/tasks/${task._id}`).set('Authorization', `Bearer ${token1}`).send({ status: 'done'});

        expect(res.statusCode).toEqual(200);
        expect(res.body.data.task.status).toEqual('done');
        expect(res.body.data.task.completedAt).toBeDefined();
    });

    test('DELETE /api/v1/tasks/:id - should delete a task', async() => {
        const task = await Task.create({ title: 'Task to Delete', owner: user1Id});

        const res = await request(app).delete(`/api/v1/tasks/${task._id}`).set('Authorization', `Beareer ${token1}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeNull();

        const checkTask = await Task.findById(task._id);
        expect(checkTask).toBeNull();
    });
});