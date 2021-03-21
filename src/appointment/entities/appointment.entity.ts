import { User } from "src/users/entities";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { AppointmentStatus } from "./appointment.enum";

@Entity()
export class Appointment {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @ManyToOne(() => User, user => user.appointments)
    public user: User;

    @Column()
    public date: Date;

    @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.Pending,
    })
    public status: AppointmentStatus;
}