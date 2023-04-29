class HttpError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

// 401
export class UnAuthError extends HttpError {}

// 409
export class ConflictError extends HttpError {}

// can add more...