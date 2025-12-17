/**
 * Organization model.
 */
export interface Organization {
  id: number;
  name: string;
  slug: string;
  account_id: number;
  role: string;
  created_at: string;
}

/**
 * Project model.
 */
export interface Project {
  id: number;
  name: string;
  organization_id: number;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Source model.
 */
export interface Source {
  id: number;
  slug: string;
  ingestion_id: string;
  type: string;
  eps: number;
  status: string;
  connection_count: number;
  auth_type: string;
  verify_signature: boolean;
  webhook_secret_set: boolean;
  auth_username?: string;
  auth_key_name?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Destination model.
 */
export interface Destination {
  id: number;
  name: string;
  url: string;
  eps: number;
  status: string;
  created_at: string;
  updated_at: string;
}

/**
 * Connection model.
 */
export interface Connection {
  id: number;
  source_id: number;
  destination_id: number;
  status: string;
  eps: number;
  max_retries: number;
  created_at: string;
  updated_at: string;
}

/**
 * Event model.
 */
export interface Event {
  id: number;
  event_id: string;
  source_id: number;
  project_id: number;
  raw_body: string;
  headers: Record<string, any>;
  status: string;
  delivery_attempts?: DeliveryAttempt[];
  created_at: string;
}

/**
 * Delivery Attempt model.
 */
export interface DeliveryAttempt {
  id: number;
  event_id: string;
  connection_id: number;
  status: string;
  status_code: number;
  error_reason?: string;
  duration_ms: number;
  created_at: string;
}

/**
 * List Organizations Response.
 */
export interface ListOrganizationsResponse {
  organizations: Organization[];
}

/**
 * List Projects Response.
 */
export interface ListProjectsResponse {
  projects: Project[];
}

/**
 * List Sources Response.
 */
export interface ListSourcesResponse {
  sources: Source[];
}

/**
 * List Destinations Response.
 */
export interface ListDestinationsResponse {
  destinations: Destination[];
}

/**
 * List Connections Response.
 */
export interface ListConnectionsResponse {
  connections: Connection[];
}

/**
 * List Events Response.
 */
export interface ListEventsResponse {
  requests: Event[];
  total: number;
  limit: number;
  offset: number;
}

/**
 * Get Event Response.
 */
export interface GetEventResponse {
  request: Event;
}

/**
 * List Delivery Attempts Response.
 */
export interface ListDeliveryAttemptsResponse {
  attempts: DeliveryAttempt[];
  total: number;
  limit: number;
  offset: number;
}

/**
 * Create Organization Request.
 */
export interface CreateOrganizationRequest {
  name: string;
}

/**
 * Create Project Request.
 */
export interface CreateProjectRequest {
  name: string;
  is_default?: boolean;
}

/**
 * Update Project Request.
 */
export interface UpdateProjectRequest {
  name: string;
}

/**
 * Create Source Request.
 */
export interface CreateSourceRequest {
  name: string;
  eps: number;
  auth_type: string;
}

/**
 * Create Destination Request.
 */
export interface CreateDestinationRequest {
  name: string;
  url: string;
  eps: number;
}

/**
 * Create Connection Request.
 */
export interface CreateConnectionRequest {
  source_id: number;
  destination_id: number;
  status: string;
  eps: number;
  max_retries: number;
}

/**
 * Replay Event Request.
 */
export interface ReplayEventRequest {
  event_id: string;
  destination_id?: number;
  connection_id?: number;
}

/**
 * Replay Event Response.
 */
export interface ReplayEventResponse {
  success: boolean;
  status: string;
  status_code: number;
  error_reason?: string;
  duration_ms: number;
  attempt_id: number;
}

/**
 * Create Source Response.
 */
export interface CreateSourceResponse {
  source: Source;
}

/**
 * Create Project Response.
 */
export interface CreateProjectResponse {
  project: Project;
}

/**
 * Create Destination Response.
 */
export interface CreateDestinationResponse {
  destination: Destination;
}

/**
 * Create Connection Response.
 */
export interface CreateConnectionResponse {
  connection: Connection;
}

/**
 * Get Source Response.
 */
export interface GetSourceResponse {
  source: Source;
}

/**
 * Get Destination Response.
 */
export interface GetDestinationResponse {
  destination: Destination;
}

/**
 * Get Connection Response.
 */
export interface GetConnectionResponse {
  connection: Connection;
}

