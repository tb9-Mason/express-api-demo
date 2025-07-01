import { GraphQLError, GraphQLErrorExtensions } from 'graphql';

const ERROR_CODE = 'UNKNOWN_ERROR';
const CLASS_NAME = 'UnknownError';

export class UnknownError extends GraphQLError {
  constructor(message: string = 'An unknown server error occurred', extensions: GraphQLErrorExtensions = {}) {
    const options = { extensions: { ...extensions, code: ERROR_CODE } };
    super(message, options);
    Object.setPrototypeOf(this, UnknownError.prototype);
    Object.defineProperty(this, 'name', { value: CLASS_NAME });
  }
}
