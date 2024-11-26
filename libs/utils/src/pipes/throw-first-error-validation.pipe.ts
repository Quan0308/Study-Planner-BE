import { ValidationPipe } from "@nestjs/common";
import { BadRequestException } from "@nestjs/common";
import { ValidationError } from "class-validator";

export function getContraints(error: ValidationError): Record<string, string> {
  if (error.constraints) {
    return error.constraints;
  }

  let contrains = {};
  if (error.children) {
    for (const child of error.children) {
      contrains = {
        ...contrains,
        ...getContraints(child),
      };
    }
  }
  return contrains;
}

export const ThrowFirstErrorValidationPipe = new ValidationPipe({
  exceptionFactory: (errors) => {
    const firstError = errors[0];
    const constraints = getContraints(firstError);
    const firstConstraintKey = Object.keys(constraints)[0];
    throw new BadRequestException(constraints[firstConstraintKey]);
  },
});
