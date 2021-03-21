import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'customText', async: false })
export class PasswordValidator implements ValidatorConstraintInterface {
    format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    validate(text: string, args: ValidationArguments) {
        return this.format.test(text); // for async validations you must return a Promise<boolean> here
    }

    defaultMessage(args: ValidationArguments) {
        return 'La contraseña debe contener al menos un caracter especial';
    }
}