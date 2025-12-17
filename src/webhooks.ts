import { VolleyClient } from './client';
import axios, { AxiosInstance } from 'axios';

/**
 * Webhooks API methods.
 */
export class Webhooks {
  private readonly httpClient: AxiosInstance;

  constructor(private readonly client: VolleyClient) {
    // Create a separate HTTP client for webhook ingestion (no auth required)
    this.httpClient = axios.create({
      baseURL: client.getBaseUrl(),
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Sends a webhook to a source.
   *
   * @param sourceId The ingestion ID of the source
   * @param payload The webhook payload
   * @returns The event ID of the queued webhook
   */
  async send(sourceId: string, payload: any): Promise<string> {
    try {
      const response = await this.httpClient.post(
        `/hook/${sourceId}`,
        payload
      );

      // Parse response to get event_id
      const eventId = response.data?.event_id;
      if (!eventId) {
        throw new Error('No event_id in response');
      }

      return String(eventId);
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const statusCode = error.response?.status || 0;
        const errorMessage =
          error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          'Webhook request failed';

        throw new Error(`${errorMessage} (Status: ${statusCode})`);
      }
      throw new Error(error?.message || 'Failed to send webhook');
    }
  }
}

