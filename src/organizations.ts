import { VolleyClient } from './client';
import {
  Organization,
  ListOrganizationsResponse,
  CreateOrganizationRequest,
} from './models';

/**
 * Organizations API methods.
 */
export class Organizations {
  constructor(private readonly client: VolleyClient) {}

  /**
   * Lists all organizations the user has access to.
   */
  async list(): Promise<Organization[]> {
    const response = await this.client.request<ListOrganizationsResponse>(
      'GET',
      '/api/org/list'
    );
    return response.organizations;
  }

  /**
   * Gets the current organization.
   *
   * @param organizationId Optional organization ID. If undefined, uses default organization.
   */
  async get(organizationId?: number): Promise<Organization> {
    const originalOrgId = this.client.getOrganizationId();
    if (organizationId !== undefined) {
      this.client.setOrganizationId(organizationId);
    }

    try {
      return await this.client.request<Organization>('GET', '/api/org');
    } finally {
      this.client.setOrganizationId(originalOrgId || 0);
      if (originalOrgId === undefined) {
        this.client.clearOrganizationId();
      }
    }
  }

  /**
   * Creates a new organization.
   */
  async create(request: CreateOrganizationRequest): Promise<Organization> {
    return await this.client.request<Organization>('POST', '/api/org', request);
  }
}

