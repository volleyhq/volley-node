import { VolleyClient } from './client';
import { ListDeliveryAttemptsResponse } from './models';

/**
 * Options for listing delivery attempts.
 */
export interface ListDeliveryAttemptsOptions {
  event_id?: string;
  source_id?: number;
  destination_id?: number;
  connection_id?: number;
  status?: string;
  start_time?: string;
  end_time?: string;
  sort?: string;
  limit?: number;
  offset?: number;
}

/**
 * Delivery Attempts API methods.
 */
export class DeliveryAttempts {
  constructor(private readonly client: VolleyClient) {}

  /**
   * Lists all delivery attempts for a project with optional filters.
   */
  async list(
    projectId: number,
    options?: ListDeliveryAttemptsOptions
  ): Promise<ListDeliveryAttemptsResponse> {
    const params: Record<string, string> = {};
    if (options) {
      if (options.event_id) {
        params.event_id = options.event_id;
      }
      if (options.source_id !== undefined) {
        params.source_id = String(options.source_id);
      }
      if (options.destination_id !== undefined) {
        params.destination_id = String(options.destination_id);
      }
      if (options.connection_id !== undefined) {
        params.connection_id = String(options.connection_id);
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
      if (options.sort) {
        params.sort = options.sort;
      }
      if (options.limit !== undefined) {
        params.limit = String(options.limit);
      }
      if (options.offset !== undefined) {
        params.offset = String(options.offset);
      }
    }

    return await this.client.request<ListDeliveryAttemptsResponse>(
      'GET',
      `/api/projects/${projectId}/delivery-attempts`,
      undefined,
      { params }
    );
  }
}

