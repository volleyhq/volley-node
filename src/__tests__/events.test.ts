import { VolleyClient } from '../client';
import nock from 'nock';

describe('Events', () => {
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

  test('lists events with filters', async () => {
    const mockResponse = {
      requests: [
        {
          id: 1,
          event_id: 'evt_abc123',
          source_id: 10,
          status: 'failed',
          created_at: '2024-01-01T00:00:00Z',
        },
      ],
      total: 1,
      limit: 50,
      offset: 0,
    };

    nock(baseUrl)
      .get('/api/projects/1/requests')
      .query({ status: 'failed', limit: '50' })
      .reply(200, mockResponse);

    const events = await client.events.list(1, {
      status: 'failed',
      limit: 50,
    });
    expect(events.total).toBe(1);
    expect(events.requests).toHaveLength(1);
    expect(events.requests[0].event_id).toBe('evt_abc123');
  });

  test('gets event', async () => {
    const mockResponse = {
      request: {
        id: 123,
        event_id: 'evt_abc123',
        source_id: 10,
        project_id: 1,
        raw_body: '{"event": "user.created"}',
        headers: { 'Content-Type': 'application/json' },
        status: 'failed',
        created_at: '2024-01-01T00:00:00Z',
      },
    };

    nock(baseUrl)
      .get('/api/requests/123')
      .reply(200, mockResponse);

    const event = await client.events.get(123);
    expect(event.event_id).toBe('evt_abc123');
    expect(event.status).toBe('failed');
  });

  test('replays event', async () => {
    const mockResponse = {
      success: true,
      status: 'success',
      status_code: 200,
      duration_ms: 150,
      attempt_id: 456,
    };

    nock(baseUrl)
      .post('/api/replay-event', { event_id: 'evt_abc123def456' })
      .reply(200, mockResponse);

    const result = await client.events.replay({
      event_id: 'evt_abc123def456',
    });
    expect(result.success).toBe(true);
    expect(result.status_code).toBe(200);
  });
});

