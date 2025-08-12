jest.mock('../services/placesService', () => ({
  getTouristPlaces: jest.fn(async () => ([{ name: 'Place', address: 'Addr' }])),
}));

const places = require('../handlers/places');

describe('places handler', () => {
  test('getPlaces returns 400 on missing params', async () => {
    const res = await places.getPlaces({ queryStringParameters: {} });
    expect(res.statusCode).toBe(400);
  });

  test('getPlaces returns 200 on valid params', async () => {
    const res = await places.getPlaces({ queryStringParameters: { lat: '1', lon: '2' } });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(Array.isArray(body)).toBe(true);
  });
});


