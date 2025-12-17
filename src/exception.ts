/**
 * Exception thrown when a Volley API request fails.
 */
export class VolleyException extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number = 0) {
    super(message);
    this.name = 'VolleyException';
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, VolleyException.prototype);
  }

  /**
   * Checks if this is an authentication error (401).
   */
  isUnauthorized(): boolean {
    return this.statusCode === 401;
  }

  /**
   * Checks if this is a forbidden error (403).
   */
  isForbidden(): boolean {
    return this.statusCode === 403;
  }

  /**
   * Checks if this is a not found error (404).
   */
  isNotFound(): boolean {
    return this.statusCode === 404;
  }

  /**
   * Checks if this is a rate limit error (429).
   */
  isRateLimited(): boolean {
    return this.statusCode === 429;
  }
}

