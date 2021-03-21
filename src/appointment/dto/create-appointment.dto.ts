import { IsDate, IsUUID } from 'class-validator';

export class CreateAppointmentDto {
    @IsUUID()
    userId: string;

    @IsDate()
    date: Date;
}