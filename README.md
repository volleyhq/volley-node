# Volley Node.js SDK

Official Node.js/TypeScript SDK for the Volley API. This SDK provides a convenient way to interact with the Volley webhook infrastructure API.

[Volley](https://volleyhooks.com) is a webhook infrastructure platform that provides reliable webhook delivery, rate limiting, retries, monitoring, and more.

## Resources

- **Documentation**: [https://docs.volleyhooks.com](https://docs.volleyhooks.com)
- **Getting Started Guide**: [https://docs.volleyhooks.com/getting-started](https://docs.volleyhooks.com/getting-started)
- **API Reference**: [https://docs.volleyhooks.com/api](https://docs.volleyhooks.com/api)
- **Authentication Guide**: [https://docs.volleyhooks.com/authentication](https://docs.volleyhooks.com/authentication)
- **Security Guide**: [https://docs.volleyhooks.com/security](https://docs.volleyhooks.com/security)
- **Console**: [https://app.volleyhooks.com](https://app.volleyhooks.com)
- **Website**: [https://volleyhooks.com](https://volleyhooks.com)

## Installation

```bash
npm install @volleyhooks/volley-node
```

or with yarn:

```bash
yarn add @volleyhooks/volley-node
```

## Quick Start

```typescript
import { VolleyClient } from '@volleyhooks/volley-node';

// Create a client with your API token
const client = new VolleyClient('your-api-token');

// Optionally set organization context
client.setOrganizationId(123);

// List organizations
const orgs = await client.organizations.list();
for (const org of orgs) {
  console.log(`Organization: ${org.name} (ID: ${org.id})`);
}
```

## Authentication

Volley uses API tokens for authentication. These are long-lived tokens designed for programmatic access.

### Getting Your API Token

1. Log in to the [Volley Console](https://app.volleyhooks.com)
2. Navigate to **Settings → Account → API Token**
3. Click **View Token** (you may need to verify your password)
4. Copy the token and store it securely

**Important**: API tokens are non-expiring and provide full access to your account. Keep them secure and rotate them if compromised. See the [Security Guide](https://docs.volleyhooks.com/security) for best practices.

```typescript
const client = new VolleyClient('your-api-token');
```

For more details on authentication, API tokens, and security, see the [Authentication Guide](https://docs.volleyhooks.com/authentication) and [Security Guide](https://docs.volleyhooks.com/security).

## Organization Context

When you have multiple organizations, you need to specify which organization context to use for API requests. The API verifies that resources (like projects) belong to the specified organization.

You can set the organization context in two ways:

```typescript
// Method 1: Set organization ID for all subsequent requests
client.setOrganizationId(123);

// Method 2: Create client with organization ID
const client = new VolleyClient('your-api-token', {
  organizationId: 123,
});

// Clear organization context (uses first accessible organization)
client.clearOrganizationId();
```

**Note**: If you don't set an organization ID, the API uses your first accessible organization by default. For more details, see the [API Reference - Organization Context](https://docs.volleyhooks.com/api#organization-context).

## Examples

### Organizations

```typescript
// List all organizations
const orgs = await client.organizations.list();

// Get current organization
const org = await client.organizations.get(); // undefined = use default

// Create organization
const newOrg = await client.organizations.create({
  name: 'My Organization',
});
```

### Projects

```typescript
// List projects
const projects = await client.projects.list();

// Create project
const project = await client.projects.create({
  name: 'My Project',
  is_default: false,
});

// Update project
const updated = await client.projects.update(project.id, {
  name: 'Updated Name',
});

// Delete project
await client.projects.delete(project.id);
```

### Sources

```typescript
// List sources in a project
const sources = await client.sources.list(projectId);

// Create source
const source = await client.sources.create(projectId, {
  name: 'Stripe Webhooks',
  eps: 10,
  auth_type: 'none',
});

// Get source details
const source = await client.sources.get(sourceId);

// Update source
const updated = await client.sources.update(sourceId, {
  name: 'Updated Source Name',
  eps: 20,
  auth_type: 'none',
});
```

### Destinations

```typescript
// List destinations
const destinations = await client.destinations.list(projectId);

// Create destination
const dest = await client.destinations.create(projectId, {
  name: 'Production Endpoint',
  url: 'https://api.example.com/webhooks',
  eps: 5,
});
```

### Connections

```typescript
// List connections
const connections = await client.projects.getConnections(projectId);

// Create connection
const conn = await client.connections.create(projectId, {
  source_id: sourceId,
  destination_id: destId,
  status: 'enabled',
  eps: 5,
  max_retries: 3,
});
```

### Events

```typescript
// List events with filters
const events = await client.events.list(projectId, {
  status: 'failed',
  source_id: sourceId,
  limit: 50,
  offset: 0,
});

// Get event details
const event = await client.events.get(requestId);

// Replay failed event
const result = await client.events.replay({
  event_id: 'evt_abc123def456',
});
```

### Delivery Attempts

```typescript
// List delivery attempts
const attempts = await client.deliveryAttempts.list(projectId, {
  event_id: 'evt_abc123',
  status: 'failed',
  limit: 50,
});
```

### Sending Webhooks

```typescript
// Send a webhook to a source
const eventId = await client.webhooks.send('source_ingestion_id', {
  event: 'user.created',
  data: {
    user_id: '123',
    email: 'user@example.com',
  },
});
```

## Error Handling

The SDK throws `VolleyException` for API errors:

```typescript
import { VolleyException } from '@volleyhooks/volley-node';

try {
  const org = await client.organizations.get(orgId);
} catch (error) {
  if (error instanceof VolleyException) {
    if (error.isUnauthorized()) {
      console.error('Authentication failed');
    } else if (error.isNotFound()) {
      console.error('Organization not found');
    } else {
      console.error(`API Error: ${error.message} (Status: ${error.statusCode})`);
    }
  } else {
    console.error('Error:', error);
  }
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `202` - Accepted (webhook queued)
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid or missing API token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `429` - Rate Limit Exceeded
- `500` - Internal Server Error

For more details on error responses, see the [API Reference - Response Codes](https://docs.volleyhooks.com/api#response-codes).

## Client Configuration

You can configure the client with various options:

```typescript
// Custom base URL (for testing)
const client = new VolleyClient('token', {
  baseUrl: 'https://api-staging.volleyhooks.com',
});

// Custom timeout
const client = new VolleyClient('token', {
  timeout: 60000, // 60 seconds
});

// Custom HTTP client (Axios instance)
import axios from 'axios';

const customHttpClient = axios.create({
  timeout: 60000,
  // ... other axios config
});

const client = new VolleyClient('token', {
  httpClient: customHttpClient,
});
```

## TypeScript Support

The SDK is written in TypeScript and includes full type definitions. All types are exported:

```typescript
import {
  VolleyClient,
  Organization,
  Project,
  Source,
  Event,
  // ... other types
} from '@volleyhooks/volley-node';
```

## Additional Resources

### Documentation

- **[Getting Started](https://docs.volleyhooks.com/getting-started)** - Set up your account and create your first webhook
- **[How It Works](https://docs.volleyhooks.com/how-it-works)** - Understand Volley's architecture
- **[Webhooks Guide](https://docs.volleyhooks.com/webhooks)** - Learn about webhook best practices and signature verification
- **[Rate Limiting](https://docs.volleyhooks.com/rate-limiting)** - Configure rate limits for your webhooks
- **[Monitoring](https://docs.volleyhooks.com/monitoring)** - Monitor webhook delivery and performance
- **[Best Practices](https://docs.volleyhooks.com/best-practices)** - Webhook development best practices
- **[FAQ](https://docs.volleyhooks.com/faq)** - Frequently asked questions

### Use Cases

- [Stripe Webhook Localhost Testing](https://docs.volleyhooks.com/use-cases/stripe-webhook-localhost)
- [Retrying Failed Webhooks](https://docs.volleyhooks.com/use-cases/retrying-failed-webhooks)
- [Webhook Event Replay](https://docs.volleyhooks.com/use-cases/webhook-event-replay)
- [Webhook Fan-out](https://docs.volleyhooks.com/use-cases/webhook-fan-out)
- [Multi-Tenant Webhooks](https://docs.volleyhooks.com/use-cases/multi-tenant-webhooks)

## Testing

The SDK includes comprehensive unit tests and integration tests.

### Running Unit Tests

Unit tests use a mock HTTP server (nock) and don't require API credentials:

```bash
npm test
```

To run tests in watch mode:

```bash
npm test -- --watch
```

### Running Integration Tests

Integration tests make real API calls to the Volley API. You'll need to set your API token:

```bash
export VOLLEY_API_TOKEN="your-api-token"
npm test -- --testPathPattern=integration
```

**Note**: Integration tests are skipped if `VOLLEY_API_TOKEN` is not set.

### Test Coverage

To see test coverage:

```bash
npm test -- --coverage
```

## Support

- **Documentation**: [https://docs.volleyhooks.com](https://docs.volleyhooks.com)
- **Console**: [https://app.volleyhooks.com](https://app.volleyhooks.com)
- **Website**: [https://volleyhooks.com](https://volleyhooks.com)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

When contributing:
1. Add tests for new functionality
2. Ensure all tests pass (`npm test`)
3. Update documentation as needed

## License

MIT License - see [LICENSE](LICENSE) file for details.

