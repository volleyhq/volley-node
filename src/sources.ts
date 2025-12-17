import { VolleyClient } from './client';
import {
  Source,
  ListSourcesResponse,
  CreateSourceRequest,
  CreateSourceResponse,
  GetSourceResponse,
} from './models';

/**
 * Sources API methods.
 */
export class Sources {
  constructor(private readonly client: VolleyClient) {}

  /**
   * Lists all sources in a project.
   */
  async list(projectId: number): Promise<Source[]> {
    const response = await this.client.request<ListSourcesResponse>(
      'GET',
      `/api/projects/${projectId}/sources`
    );
    return response.sources;
  }

  /**
   * Creates a new source.
   */
  async create(
    projectId: number,
    request: CreateSourceRequest
  ): Promise<Source> {
    const response = await this.client.request<CreateSourceResponse>(
      'POST',
      `/api/projects/${projectId}/sources`,
      request
    );
    return response.source;
  }

  /**
   * Gets details of a specific source.
   */
  async get(sourceId: number): Promise<Source> {
    const response = await this.client.request<GetSourceResponse>(
      'GET',
      `/api/sources/${sourceId}`
    );
    return response.source;
  }

  /**
   * Updates a source.
   */
  async update(
    sourceId: number,
    request: CreateSourceRequest
  ): Promise<Source> {
    const response = await this.client.request<CreateSourceResponse>(
      'PUT',
      `/api/sources/${sourceId}`,
      request
    );
    return response.source;
  }

  /**
   * Deletes a source.
   */
  async delete(sourceId: number): Promise<void> {
    await this.client.request('DELETE', `/api/sources/${sourceId}`);
  }
}

