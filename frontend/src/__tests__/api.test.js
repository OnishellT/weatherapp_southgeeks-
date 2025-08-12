import { getUsers, createUser, updateUser, deleteUser } from '../services/api';

global.fetch = jest.fn();

describe('api client', () => {
  beforeEach(() => jest.resetAllMocks());

  test('getUsers returns object', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ a: 1 }) });
    const data = await getUsers();
    expect(data).toEqual({ a: 1 });
  });

  test('createUser posts body', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ id: '1' }) });
    const body = { name: 'X', zip: '12345' };
    await createUser(body);
    expect(fetch).toHaveBeenCalledWith(expect.stringMatching(/\/api\/users$/), expect.objectContaining({
      method: 'POST',
      body: JSON.stringify(body),
    }));
  });

  test('updateUser PUTs body', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) });
    await updateUser('1', { name: 'Y' });
    expect(fetch).toHaveBeenCalledWith(expect.stringMatching(/\/api\/users\/1$/), expect.objectContaining({
      method: 'PUT',
    }));
  });

  test('deleteUser DELETEs', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) });
    await deleteUser('1');
    expect(fetch).toHaveBeenCalledWith(expect.stringMatching(/\/api\/users\/1$/), expect.objectContaining({
      method: 'DELETE',
    }));
  });
});


