# Testing Guide

This document explains how to run and write tests for the Volley Node.js SDK.

## Test Structure

The SDK includes two types of tests:

1. **Unit Tests** - Use mock HTTP servers (nock), no API credentials required
2. **Integration Tests** - Make real API calls, require API token

## Running Tests

### Prerequisites

- Node.js 14.0 or higher
- npm or yarn

### Installation

```bash
npm install
```

### Unit Tests (No API Token Required)

Run all unit tests:

```bash
npm test
```

Run with watch mode:

```bash
npm test -- --watch
```

Run specific test file:

```bash
npm test -- client.test.ts
```

### Integration Tests (Requires API Token)

Integration tests make real API calls to test the SDK against the actual Volley API.

**Setup:**

1. Get your API token from [Volley Console](https://app.volleyhooks.com) → Settings → Account → API Token
2. Set the environment variable:

```bash
export VOLLEY_API_TOKEN="your-api-token"
```

**Run integration tests:**

```bash
npm test -- --testPathPattern=integration
```

**Note**: Integration tests are automatically skipped if `VOLLEY_API_TOKEN` is not set.

## Test Coverage

View test coverage:

```bash
npm test -- --coverage
```

The coverage report will be generated in the `coverage/` directory.

## Test Files

- `client.test.ts` - Client initialization and configuration tests
- `organizations.test.ts` - Organization API tests
- `projects.test.ts` - Project API tests
- `events.test.ts` - Event and replay API tests
- `integration.test.ts` - Real API integration tests

## Writing New Tests

### Unit Test Example

```typescript
import { VolleyClient } from '../client';
import nock from 'nock';

describe('MyFeature', () => {
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

  test('my feature works', async () => {
    nock(baseUrl)
      .get('/api/my-endpoint')
      .reply(200, { data: 'test' });

    const result = await client.myFeature();
    expect(result).toBeDefined();
  });
});
```

### Integration Test Example

```typescript
import { VolleyClient } from '../client';

describe('MyIntegrationTest', () => {
  const apiToken = process.env.VOLLEY_API_TOKEN;

  test.skipIf(!apiToken)('my feature works', async () => {
    const client = new VolleyClient(apiToken!);
    const result = await client.myFeature();
    expect(result).toBeDefined();
  });
});
```

## Best Practices

1. **Always test error cases** - Test both success and failure scenarios
2. **Verify request details** - Check HTTP method, path, headers, body
3. **Use descriptive test names** - `testListOrganizations` is better than `test1`
4. **Clean up mocks** - Use `nock.cleanAll()` in `beforeEach`
5. **Skip integration tests** - When API token is not available
6. **Use nock for unit tests** - To avoid real network calls

## Continuous Integration

For CI/CD pipelines:

```yaml
# Example GitHub Actions
- name: Run unit tests
  run: npm test

- name: Run integration tests
  env:
    VOLLEY_API_TOKEN: ${{ secrets.VOLLEY_API_TOKEN }}
  run: npm test -- --testPathPattern=integration
```

## Troubleshooting

### Tests fail with "connection refused"
- Make sure nock is intercepting requests
- Check that `nock.cleanAll()` is called in `beforeEach`

### Integration tests skipped
- Verify `VOLLEY_API_TOKEN` environment variable is set
- Check that `test.skipIf` is used correctly

### Test coverage is low
- Add tests for error cases
- Test edge cases and boundary conditions
- Test all public methods

