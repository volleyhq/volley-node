import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { VolleyException } from './exception';
import { Organizations } from './organizations';
import { Projects } from './projects';
import { Sources } from './sources';
import { Destinations } from './destinations';
import { Connections } from './connections';
import { Events } from './events';
import { DeliveryAttempts } from './delivery-attempts';
import { Webhooks } from './webhooks';

const DEFAULT_BASE_URL = 'https://api.volleyhooks.com';
const DEFAULT_TIMEOUT = 30000; // 30 seconds

export interface VolleyClientOptions {
  baseUrl?: string;
  organizationId?: number;
  timeout?: number;
  httpClient?: AxiosInstance;
}

/**
 * Main client for interacting with the Volley API.
 */
export class VolleyClient {
  private readonly baseUrl: string;
  private readonly apiToken: string;
  private organizationId?: number;
  private readonly httpClient: AxiosInstance;

  // API resource clients
  public readonly organizations: Organizations;
  public readonly projects: Projects;
  public readonly sources: Sources;
  public readonly destinations: Destinations;
  public readonly connections: Connections;
  public readonly events: Events;
  public readonly deliveryAttempts: DeliveryAttempts;
  public readonly webhooks: Webhooks;

  constructor(apiToken: string, options: VolleyClientOptions = {}) {
    if (!apiToken) {
      throw new Error('API token is required');
    }

    this.apiToken = apiToken;
    this.baseUrl = options.baseUrl || DEFAULT_BASE_URL;
    this.organizationId = options.organizationId;

    // Create HTTP client
    if (options.httpClient) {
      this.httpClient = options.httpClient;
    } else {
      this.httpClient = axios.create({
        baseURL: this.baseUrl,
        timeout: options.timeout || DEFAULT_TIMEOUT,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Initialize API resource clients
    this.organizations = new Organizations(this);
    this.projects = new Projects(this);
    this.sources = new Sources(this);
    this.destinations = new Destinations(this);
    this.connections = new Connections(this);
    this.events = new Events(this);
    this.deliveryAttempts = new DeliveryAttempts(this);
    this.webhooks = new Webhooks(this);
  }

  /**
   * Sets the organization ID for subsequent requests.
   */
  setOrganizationId(organizationId: number): void {
    this.organizationId = organizationId;
  }

  /**
   * Clears the organization ID (uses default organization).
   */
  clearOrganizationId(): void {
    this.organizationId = undefined;
  }

  /**
   * Gets the current organization ID.
   */
  getOrganizationId(): number | undefined {
    return this.organizationId;
  }

  /**
   * Performs an HTTP request with authentication.
   * @internal
   */
  async request<T = any>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    path: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const headers: Record<string, string> = {
        Authorization: `Bearer ${this.apiToken}`,
      };

      // Merge headers from config, converting AxiosHeaderValue to string
      if (config?.headers) {
        for (const [key, value] of Object.entries(config.headers)) {
          if (value !== null && value !== undefined) {
            if (Array.isArray(value)) {
              headers[key] = value.join(', ');
            } else {
              headers[key] = String(value);
            }
          }
        }
      }

      if (this.organizationId !== undefined) {
        headers['X-Organization-ID'] = String(this.organizationId);
      }

      const response: AxiosResponse<T> = await this.httpClient.request({
        method,
        url: path,
        data,
        headers,
        ...config,
      });

      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const statusCode = error.response?.status || 0;
        const errorMessage =
          error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          'Request failed';

        throw new VolleyException(errorMessage, statusCode);
      }
      throw new VolleyException(error?.message || 'Request failed', 0);
    }
  }

  /**
   * Gets the base URL (for testing).
   * @internal
   */
  getBaseUrl(): string {
    return this.baseUrl;
  }

  /**
   * Gets the HTTP client (for testing).
   * @internal
   */
  getHttpClient(): AxiosInstance {
    return this.httpClient;
  }
}

