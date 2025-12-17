import { VolleyClient } from '../client';
import nock from 'nock';

/**
 * Integration tests that make real API calls.
 * These tests are skipped unless VOLLEY_API_TOKEN is set.
 */
describe('Integration Tests', () => {
  const apiToken = process.env.VOLLEY_API_TOKEN;

  beforeAll(() => {
    // Clean up any existing nock mocks
    nock.cleanAll();
    
    // Disable nock's network interception for integration tests
    // This allows real HTTP requests to go through
    nock.disableNetConnect();
    nock.enableNetConnect(/api\.volleyhooks\.com/);
    
    if (!apiToken) {
      console.log('Skipping integration tests: VOLLEY_API_TOKEN not set');
    }
  });

  beforeEach(() => {
    // Ensure nock is clean before each test
    nock.cleanAll();
  });

  afterAll(() => {
    // Clean up nock after integration tests
    nock.cleanAll();
    nock.enableNetConnect();
  });

  (apiToken ? test : test.skip)('lists organizations', async () => {
    const client = new VolleyClient(apiToken!);
    const orgs = await client.organizations.list();
    expect(Array.isArray(orgs)).toBe(true);
    // May be empty for new accounts, which is OK
  });

  (apiToken ? test : test.skip)('gets organization', async () => {
    const client = new VolleyClient(apiToken!);
    const orgs = await client.organizations.list();
    if (orgs.length === 0) {
      return; // Skip if no organizations
    }

    const org = await client.organizations.get(orgs[0].id);
    expect(org.id).toBe(orgs[0].id);
  });

  (apiToken ? test : test.skip)('lists projects', async () => {
    const client = new VolleyClient(apiToken!);
    const orgs = await client.organizations.list();
    if (orgs.length === 0) {
      return; // Skip if no organizations
    }

    client.setOrganizationId(orgs[0].id);
    const projects = await client.projects.list();
    expect(Array.isArray(projects)).toBe(true);
    // May be empty, which is OK
  });

  (apiToken ? test : test.skip)('lists sources', async () => {
    const client = new VolleyClient(apiToken!);
    const orgs = await client.organizations.list();
    if (orgs.length === 0) {
      return;
    }

    client.setOrganizationId(orgs[0].id);
    const projects = await client.projects.list();
    if (projects.length === 0) {
      return;
    }

    const sources = await client.sources.list(projects[0].id);
    expect(Array.isArray(sources)).toBe(true);
    // May be empty, which is OK
  });
});

