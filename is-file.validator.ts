import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsFile(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isFile',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!value) {
            return false;
          }
          if (!(value instanceof Object && value.buffer instanceof Buffer)) {
            return false;
          }
          return true;
        },
      },
    });
  };
}