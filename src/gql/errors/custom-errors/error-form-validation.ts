import { ValidationError } from 'class-validator';
import { GraphQLError, GraphQLErrorExtensions } from 'graphql';

const ERROR_CODE = 'FORM_VALIDATION_ERROR';
const CLASS_NAME = 'FormValidationError';

export class FormValidationError extends GraphQLError {
  constructor(
    message: string = 'Form validation error',
    extensions: GraphQLErrorExtensions = {},
    validationErrors: ValidationError[],
  ) {
    if (validationErrors.length) {
      const messages: string[] = [];
      validationErrors.forEach((e) => {
        for (const constraintKey in e.constraints) {
          messages.push(e.constraints[constraintKey]);
        }
      });
      message = messages.join(',');
    }
    const options = {
      extensions: { ...extensions, code: ERROR_CODE, validationErrors },
    };
    super(message, options);
    Object.setPrototypeOf(this, FormValidationError.prototype);
    Object.defineProperty(this, 'name', { value: CLASS_NAME });
  }
}
