const { ref, child, set, get, update, remove } = require('firebase/database');
const { getGeoData } = require('../services/weatherService');

// Mock firebase/database
jest.mock('firebase/database', () => ({
  ref: jest.fn(() => ({ key: 'users' })),
  child: jest.fn((ref, id) => ({ ref, id, key: id })),
  set: jest.fn(() => Promise.resolve()),
  get: jest.fn(() => Promise.resolve({ val: () => ({}) })),
  update: jest.fn(() => Promise.resolve()),
  remove: jest.fn(() => Promise.resolve()),
}));

// Mock firebaseService
jest.mock('../services/firebaseService', () => ({
  initializeFirebase: jest.fn(),
  getDB: jest.fn(() => ({})),
  getUsersRef: jest.fn(() => ({ key: 'users' })),
}));

// Mock weatherService
jest.mock('../services/weatherService', () => ({
  getGeoData: jest.fn(async () => ({ latitude: 1, longitude: 2, timezone: 'UTC' })),
}));

// Mock validation
jest.mock('../utils/validation', () => ({
  validateUser: jest.fn((data) => {
    const errors = [];
    if (!data.name || !data.zip) {
      errors.push('Name and zip are required');
    }
    return errors;
  }),
}));

const users = require('../handlers/users');

const mkEvent = (overrides = {}) => ({
  body: JSON.stringify({ name: 'Alice', zip: '90210' }),
  pathParameters: {},
  queryStringParameters: {},
  ...overrides,
});

describe('users handlers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('createUser returns 201', async () => {
    const res = await users.createUser(mkEvent());
    expect(res.statusCode).toBe(201);
    const body = JSON.parse(res.body);
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('name', 'Alice');
  });

  test('createUser handles missing body', async () => {
    const res = await users.createUser({});
    expect(res.statusCode).toBe(400);
    const body = JSON.parse(res.body);
    expect(body.errors).toBeDefined();
  });

  test('createUser handles invalid body', async () => {
    const res = await users.createUser({ body: 'invalid json' });
    expect(res.statusCode).toBe(400);
    const body = JSON.parse(res.body);
    expect(body.errors).toBeDefined();
  });

  test('createUser handles base64 encoded body', async () => {
    const event = mkEvent();
    event.isBase64Encoded = true;
    event.body = Buffer.from(JSON.stringify({ name: 'Bob', zip: '10001' })).toString('base64');
    const res = await users.createUser(event);
    expect(res.statusCode).toBe(201);
  });

  test('createUser handles validation errors', async () => {
    const { validateUser } = require('../utils/validation');
    validateUser.mockReturnValueOnce(['Name is required']);
    const res = await users.createUser(mkEvent({ body: JSON.stringify({ name: '', zip: '' }) }));
    expect(res.statusCode).toBe(400);
    const body = JSON.parse(res.body);
    expect(body.errors).toBeDefined();
  });

  test('createUser handles zip code not found', async () => {
    const { getGeoData } = require('../services/weatherService');
    getGeoData.mockResolvedValueOnce(null);
    const res = await users.createUser(mkEvent());
    expect(res.statusCode).toBe(400);
    const body = JSON.parse(res.body);
    expect(body.error).toContain('Zip code not found');
  });

  test('listUsers returns 200 object', async () => {
    const res = await users.listUsers();
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(typeof body).toBe('object');
  });

  test('getUserById returns 200 for existing user', async () => {
    const { get } = require('firebase/database');
    get.mockResolvedValueOnce({ val: () => ({ id: '1', name: 'Alice' }) });
    const res = await users.getUserById(mkEvent({ pathParameters: { id: '1' } }));
    expect(res.statusCode).toBe(200);
  });

  test('getUserById returns 404 for non-existing user', async () => {
    const { get } = require('firebase/database');
    get.mockResolvedValueOnce({ val: () => null });
    const res = await users.getUserById(mkEvent({ pathParameters: { id: '999' } }));
    expect(res.statusCode).toBe(404);
  });

  test('updateUser returns 200 for valid update', async () => {
    const { get } = require('firebase/database');
    get.mockResolvedValueOnce({ val: () => ({ id: '1', name: 'Alice', zip: '90210' }) });
    const res = await users.updateUser(mkEvent({ 
      pathParameters: { id: '1' },
      body: JSON.stringify({ name: 'Alice Updated', zip: '10001' })
    }));
    expect(res.statusCode).toBe(200);
  });

  test('updateUser returns 404 for non-existing user', async () => {
    const { get } = require('firebase/database');
    get.mockResolvedValueOnce({ val: () => null });
    const res = await users.updateUser(mkEvent({ 
      pathParameters: { id: '999' },
      body: JSON.stringify({ name: 'Alice Updated' })
    }));
    expect(res.statusCode).toBe(404);
  });

  test('updateUser handles zip code change with geo lookup', async () => {
    const { get } = require('firebase/database');
    const { getGeoData } = require('../services/weatherService');
    get.mockResolvedValueOnce({ val: () => ({ id: '1', name: 'Alice', zip: '90210' }) });
    getGeoData.mockResolvedValueOnce({ latitude: 40.7, longitude: -74.0, timezone: 'America/New_York' });
    const res = await users.updateUser(mkEvent({ 
      pathParameters: { id: '1' },
      body: JSON.stringify({ zip: '10001' })
    }));
    expect(res.statusCode).toBe(200);
  });

  test('updateUser handles zip code not found during update', async () => {
    const { get } = require('firebase/database');
    const { getGeoData } = require('../services/weatherService');
    get.mockResolvedValueOnce({ val: () => ({ id: '1', name: 'Alice', zip: '90210' }) });
    getGeoData.mockResolvedValueOnce(null);
    const res = await users.updateUser(mkEvent({ 
      pathParameters: { id: '1' },
      body: JSON.stringify({ zip: '99999' })
    }));
    expect(res.statusCode).toBe(400);
  });

  test('deleteUser returns 204', async () => {
    const res = await users.deleteUser(mkEvent({ pathParameters: { id: '1' } }));
    expect(res.statusCode).toBe(204);
  });

  test('deleteUser handles missing id', async () => {
    const res = await users.deleteUser(mkEvent({ pathParameters: {} }));
    expect(res.statusCode).toBe(204);
  });
});


