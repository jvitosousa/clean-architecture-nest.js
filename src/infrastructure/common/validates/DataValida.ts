import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import * as moment from 'moment';

@ValidatorConstraint({ async: true })
export class DataValidaConstraint implements ValidatorConstraintInterface {
  validate(data: any, args: ValidationArguments) {
    const dataConverted = moment(data);
    if (!data) return false;
    const dataAtual = moment();
    return dataConverted.isBefore(dataAtual);
  }
}

export function IsDataValida(validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: DataValidaConstraint,
    });
  };
}
