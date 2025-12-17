import { VolleyClient } from '../client';
import nock from 'nock';

describe('VolleyClient', () => {
  const apiToken = 'test-token';
  const baseUrl = 'https://api.volleyhooks.com';

  beforeEach(() => {
    nock.cleanAll();
  });

  afterEach(() => {
    nock.isDone();
  });

  test('creates client with API token', () => {
    const client = new VolleyClient(apiToken);
    expect(client).toBeDefined();
  });

  test('creates client with custom base URL', () => {
    const customUrl = 'https://api-staging.volleyhooks.com';
    const client = new VolleyClient(apiToken, { baseUrl: customUrl });
    expect(client.getBaseUrl()).toBe(customUrl);
  });

  test('sets organization ID', () => {
    const client = new VolleyClient(apiToken);
    client.setOrganizationId(123);
    expect(client.getOrganizationId()).toBe(123);
  });

  test('clears organization ID', () => {
    const client = new VolleyClient(apiToken);
    client.setOrganizationId(123);
    client.clearOrganizationId();
    expect(client.getOrganizationId()).toBeUndefined();
  });

  test('creates client with organization ID', () => {
    const client = new VolleyClient(apiToken, { organizationId: 456 });
    expect(client.getOrganizationId()).toBe(456);
  });

  test('throws error if API token is missing', () => {
    expect(() => {
      new VolleyClient('');
    }).toThrow('API token is required');
  });
});

