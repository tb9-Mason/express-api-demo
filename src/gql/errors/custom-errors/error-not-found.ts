import { GraphQLError, GraphQLErrorExtensions } from 'graphql';

const ERROR_CODE = 'NOT_FOUND_ERROR';
const CLASS_NAME = 'NotFoundError';

export class NotFoundError extends GraphQLError {
  constructor(message: string = 'Not found', extensions: GraphQLErrorExtensions = {}) {
    const options = { extensions: { ...extensions, code: ERROR_CODE } };
    super(message, options);
    Object.setPrototypeOf(this, NotFoundError.prototype);
    Object.defineProperty(this, 'name', { value: CLASS_NAME });
  }
}
