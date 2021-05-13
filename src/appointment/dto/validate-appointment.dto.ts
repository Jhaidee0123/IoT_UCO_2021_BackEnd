import { IsDate, IsEmail } from 'class-validator';

export class ValidateAppointmentDto {
    @IsDate()
    date: Date;

    @IsEmail()
    emailUser: string;
}