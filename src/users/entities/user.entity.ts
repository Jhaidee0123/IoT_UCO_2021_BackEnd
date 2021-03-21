import { Appointment } from 'src/appointment/entities/appointment.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from './user-role.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public firstName: string;

  @Column()
  public lastName: string;

  @Column({ default: true })
  public isActive: boolean;

  @Column({ nullable: true })
  public vaultName: string;
  
  @Column({ unique: true })
  public email: string;

  @Column()
  public password: string;

  @Column({ nullable: true })
  public pin: number;

  @OneToMany(() => Appointment, appointment => appointment.user)
  public appointments: Appointment[];

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.PowerUser,
  })
  public role: UserRole;
}
