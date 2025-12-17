import { VolleyClient } from './client';
import {
  Project,
  ListProjectsResponse,
  CreateProjectRequest,
  UpdateProjectRequest,
  CreateProjectResponse,
  Connection,
  ListConnectionsResponse,
} from './models';

/**
 * Projects API methods.
 */
export class Projects {
  constructor(private readonly client: VolleyClient) {}

  /**
   * Lists all projects in the current organization.
   */
  async list(): Promise<Project[]> {
    const response = await this.client.request<ListProjectsResponse>(
      'GET',
      '/api/projects'
    );
    return response.projects;
  }

  /**
   * Creates a new project.
   */
  async create(request: CreateProjectRequest): Promise<Project> {
    const response = await this.client.request<CreateProjectResponse>(
      'POST',
      '/api/projects',
      request
    );
    return response.project;
  }

  /**
   * Updates a project's name.
   */
  async update(
    projectId: number,
    request: UpdateProjectRequest
  ): Promise<Project> {
    const response = await this.client.request<CreateProjectResponse>(
      'PUT',
      `/api/projects/${projectId}`,
      request
    );
    return response.project;
  }

  /**
   * Deletes a project.
   */
  async delete(projectId: number): Promise<void> {
    await this.client.request('DELETE', `/api/projects/${projectId}`);
  }

  /**
   * Lists all connections in a project.
   */
  async getConnections(projectId: number): Promise<Connection[]> {
    const response = await this.client.request<ListConnectionsResponse>(
      'GET',
      `/api/projects/${projectId}/connections`
    );
    return response.connections;
  }
}

