import { VolleyClient } from './client';
import {
  Connection,
  CreateConnectionRequest,
  CreateConnectionResponse,
  GetConnectionResponse,
} from './models';

/**
 * Connections API methods.
 */
export class Connections {
  constructor(private readonly client: VolleyClient) {}

  /**
   * Creates a connection between a source and destination.
   */
  async create(
    projectId: number,
    request: CreateConnectionRequest
  ): Promise<Connection> {
    const response = await this.client.request<CreateConnectionResponse>(
      'POST',
      `/api/projects/${projectId}/connections`,
      request
    );
    return response.connection;
  }

  /**
   * Gets details and metrics for a connection.
   */
  async get(connectionId: number): Promise<Connection> {
    const response = await this.client.request<GetConnectionResponse>(
      'GET',
      `/api/connections/${connectionId}`
    );
    return response.connection;
  }

  /**
   * Updates a connection.
   */
  async update(
    connectionId: number,
    request: CreateConnectionRequest
  ): Promise<Connection> {
    const response = await this.client.request<CreateConnectionResponse>(
      'PUT',
      `/api/connections/${connectionId}`,
      request
    );
    return response.connection;
  }

  /**
   * Deletes a connection.
   */
  async delete(connectionId: number): Promise<void> {
    await this.client.request('DELETE', `/api/connections/${connectionId}`);
  }
}

