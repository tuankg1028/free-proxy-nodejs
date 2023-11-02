import { getProxies } from './';
describe('Get proxies', () => {
  jest.setTimeout(60000);

  test('it shoud return an array', async () => {
    const proxies = await getProxies();

    expect(Array.isArray(proxies)).toBe(true);
  });
});
