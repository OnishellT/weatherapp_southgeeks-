jest.mock('../services/weatherService', () => ({
  getCurrentWeather: jest.fn(async () => ({ temp: 72 })),
}));

const weather = require('../handlers/weather');

describe('weather handler', () => {
  test('getWeather returns 400 on missing params', async () => {
    const res = await weather.getWeather({ queryStringParameters: {} });
    expect(res.statusCode).toBe(400);
  });

  test('getWeather returns 200 on valid params', async () => {
    const res = await weather.getWeather({ queryStringParameters: { lat: '1', lon: '2' } });
    expect(res.statusCode).toBe(200);
  });
});


