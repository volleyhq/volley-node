import { VolleyClient } from '../client';
import nock from 'nock';

describe('Organizations', () => {
  const apiToken = 'test-token';
  const baseUrl = 'https://api.volleyhooks.com';
  let client: VolleyClient;

  beforeEach(() => {
    nock.cleanAll();
    client = new VolleyClient(apiToken, { baseUrl });
  });

  afterEach(() => {
    nock.isDone();
  });

  test('lists organizations', async () => {
    const mockResponse = {
      organizations: [
        {
          id: 1,
          name: 'Test Org',
          slug: 'test-org',
          account_id: 100,
          role: 'owner',
          created_at: '2024-01-01T00:00:00Z',
        },
      ],
    };

    nock(baseUrl)
      .get('/api/org/list')
      .reply(200, mockResponse);

    const orgs = await client.organizations.list();
    expect(orgs).toHaveLength(1);
    expect(orgs[0].name).toBe('Test Org');
  });

  test('gets organization', async () => {
    const mockResponse = {
      id: 123,
      name: 'Test Org',
      slug: 'test-org',
      role: 'owner',
    };

    nock(baseUrl)
      .get('/api/org')
      .reply(200, mockResponse);

    const org = await client.organizations.get(123);
    expect(org.id).toBe(123);
    expect(org.name).toBe('Test Org');
  });

  test('creates organization', async () => {
    const mockResponse = {
      id: 2,
      name: 'New Organization',
      slug: 'new-organization',
      account_id: 100,
      role: 'owner',
      created_at: '2024-01-01T00:00:00Z',
    };

    nock(baseUrl)
      .post('/api/org', { name: 'New Organization' })
      .reply(201, mockResponse);

    const org = await client.organizations.create({ name: 'New Organization' });
    expect(org.name).toBe('New Organization');
    expect(org.id).toBe(2);
  });

  test('handles API errors', async () => {
    nock(baseUrl)
      .get('/api/org/list')
      .reply(401, { error: 'unauthorized' });

    await expect(client.organizations.list()).rejects.toThrow();
  });
});

