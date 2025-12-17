import { VolleyClient } from '../client';
import nock from 'nock';

describe('Projects', () => {
  const apiToken = 'test-token';
  const baseUrl = 'https://api.volleyhooks.com';
  let client: VolleyClient;

  beforeEach(() => {
    nock.cleanAll();
    client = new VolleyClient(apiToken, { baseUrl, organizationId: 123 });
  });

  afterEach(() => {
    nock.isDone();
  });

  test('lists projects', async () => {
    const mockResponse = {
      projects: [
        {
          id: 1,
          name: 'Test Project',
          organization_id: 123,
          is_default: true,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
      ],
    };

    nock(baseUrl)
      .get('/api/projects')
      .matchHeader('X-Organization-ID', '123')
      .reply(200, mockResponse);

    const projects = await client.projects.list();
    expect(projects).toHaveLength(1);
    expect(projects[0].name).toBe('Test Project');
  });

  test('creates project', async () => {
    const mockResponse = {
      project: {
        id: 2,
        name: 'New Project',
        organization_id: 123,
        is_default: false,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
    };

    nock(baseUrl)
      .post('/api/projects', { name: 'New Project', is_default: false })
      .matchHeader('X-Organization-ID', '123')
      .reply(201, mockResponse);

    const project = await client.projects.create({
      name: 'New Project',
      is_default: false,
    });
    expect(project.name).toBe('New Project');
  });

  test('updates project', async () => {
    const mockResponse = {
      project: {
        id: 1,
        name: 'Updated Project Name',
        organization_id: 123,
        is_default: false,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
    };

    nock(baseUrl)
      .put('/api/projects/1', { name: 'Updated Project Name' })
      .matchHeader('X-Organization-ID', '123')
      .reply(200, mockResponse);

    const project = await client.projects.update(1, {
      name: 'Updated Project Name',
    });
    expect(project.name).toBe('Updated Project Name');
  });

  test('deletes project', async () => {
    nock(baseUrl)
      .delete('/api/projects/1')
      .matchHeader('X-Organization-ID', '123')
      .reply(200);

    await expect(client.projects.delete(1)).resolves.not.toThrow();
  });
});

