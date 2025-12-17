import { VolleyClient } from './client';
import {
  Event,
  ListEventsResponse,
  GetEventResponse,
  ReplayEventRequest,
  ReplayEventResponse,
} from './models';

/**
 * Options for listing events.
 */
export interface ListEventsOptions {
  source_id?: number;
  connection_id?: number;
  destination_id?: number;
  status?: string;
  start_time?: string;
  end_time?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

/**
 * Events API methods.
 */
export class Events {
  constructor(private readonly client: VolleyClient) {}

  /**
   * Lists all events/requests for a project with optional filters.
   */
  async list(
    projectId: number,
    options?: ListEventsOptions
  ): Promise<ListEventsResponse> {
    const params: Record<string, string> = {};
    if (options) {
      if (options.source_id !== undefined) {
        params.source_id = String(options.source_id);
      }
      if (options.connection_id !== undefined) {
        params.connection_id = String(options.connection_id);
      }
      if (options.destination_id !== undefined) {
        params.destination_id = String(options.destination_id);
      }
      if (options.status) {
        params.status = options.status;
      }
      if (options.start_time) {
        params.start_time = options.start_time;
      }
      if (options.end_time) {
        params.end_time = options.end_time;
      }
      if (options.search) {
        params.search = options.search;
      }
      if (options.limit !== undefined) {
        params.limit = String(options.limit);
      }
      if (options.offset !== undefined) {
        params.offset = String(options.offset);
      }
    }

    return await this.client.request<ListEventsResponse>(
      'GET',
      `/api/projects/${projectId}/requests`,
      undefined,
      { params }
    );
  }

  /**
   * Gets detailed information about a specific event by its database ID.
   */
  async get(requestId: number): Promise<Event> {
    const response = await this.client.request<GetEventResponse>(
      'GET',
      `/api/requests/${requestId}`
    );
    return response.request;
  }

  /**
   * Replays a failed event by its event_id.
   */
  async replay(request: ReplayEventRequest): Promise<ReplayEventResponse> {
    return await this.client.request<ReplayEventResponse>(
      'POST',
      '/api/replay-event',
      request
    );
  }
}

