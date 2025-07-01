import { unwrapResolverError } from '@apollo/server/errors';
import { DriverException, NotFoundError as OrmNotFoundError } from '@mikro-orm/core';
import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { ArgumentValidationError } from 'type-graphql';

import { FormValidationError } from './custom-errors/error-form-validation';
import { NotFoundError } from './custom-errors/error-not-found';
import { UnknownError } from './custom-errors/error-unknown';

export const formatError = (formattedError: GraphQLFormattedError, err: unknown): GraphQLFormattedError => {
  const originalError = unwrapResolverError(err);
  if (originalError instanceof DriverException) {
    // Database access error
    formattedError = new UnknownError('Fatal database access', formattedError.extensions);
  } else if (originalError instanceof OrmNotFoundError) {
    // findOneOrFail mikro-orm error
    formattedError = new NotFoundError(originalError.message, formattedError.extensions);
  } else if (originalError instanceof ArgumentValidationError) {
    // class-validator error
    formattedError = new FormValidationError(
      'Form validation error',
      formattedError.extensions,
      originalError.extensions.validationErrors,
    );
  } else if (!(originalError instanceof GraphQLError)) {
    // otherwise oncaught errors - unknown
    formattedError = new UnknownError(undefined, formattedError.extensions);
  }

  return formattedError;
};
