import { VolleyClient } from './client';
import {
  Destination,
  ListDestinationsResponse,
  CreateDestinationRequest,
  CreateDestinationResponse,
  GetDestinationResponse,
} from './models';

/**
 * Destinations API methods.
 */
export class Destinations {
  constructor(private readonly client: VolleyClient) {}

  /**
   * Lists all destinations in a project.
   */
  async list(projectId: number): Promise<Destination[]> {
    const response = await this.client.request<ListDestinationsResponse>(
      'GET',
      `/api/projects/${projectId}/destinations`
    );
    return response.destinations;
  }

  /**
   * Creates a new destination.
   */
  async create(
    projectId: number,
    request: CreateDestinationRequest
  ): Promise<Destination> {
    const response = await this.client.request<CreateDestinationResponse>(
      'POST',
      `/api/projects/${projectId}/destinations`,
      request
    );
    return response.destination;
  }

  /**
   * Gets details of a specific destination.
   */
  async get(destinationId: number): Promise<Destination> {
    const response = await this.client.request<GetDestinationResponse>(
      'GET',
      `/api/destinations/${destinationId}`
    );
    return response.destination;
  }

  /**
   * Updates a destination.
   */
  async update(
    destinationId: number,
    request: CreateDestinationRequest
  ): Promise<Destination> {
    const response = await this.client.request<CreateDestinationResponse>(
      'PUT',
      `/api/destinations/${destinationId}`,
      request
    );
    return response.destination;
  }

  /**
   * Deletes a destination.
   */
  async delete(destinationId: number): Promise<void> {
    await this.client.request('DELETE', `/api/destinations/${destinationId}`);
  }
}

