import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UsersService } from "src/users/services";
import { Repository } from "typeorm";
import { CreateAppointmentDto, UpdateAppointmentDto } from "../dto";
import { ValidateAppointmentDto } from "../dto/validate-appointment.dto";
import { Appointment } from "../entities/appointment.entity";
import { AppointmentStatus } from "../entities/appointment.enum";

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment) private appointmentRepository: Repository<Appointment>,
    private usersService: UsersService
  ) {}

  public async create(appointment: CreateAppointmentDto): Promise<void> {
    const user = await this.usersService.findById(appointment.userId);
    const newAppointment = await this.appointmentRepository.create(appointment);
    newAppointment.user = user;
    await this.appointmentRepository.save(newAppointment);
  }

  public async getAll(): Promise<Appointment[]> {
    return await this.appointmentRepository.find();
  }

  public async update(appointment: UpdateAppointmentDto): Promise<void> {
    const id = appointment.id;
    const appointmentToUpdate = await this.appointmentRepository.findOne({ id });
    const appointmentUpdated = Object.assign(appointmentToUpdate, appointment);
    await this.appointmentRepository.save(appointmentUpdated); 
  }

  public async rejectAppointment(id: string): Promise<void> {
    const appointment = await this.appointmentRepository.findOne({ id });
    appointment.status = AppointmentStatus.Rejected;
    await this.appointmentRepository.save(appointment);
  }
  
  public async acceptAppointment(id: string): Promise<void> {
    const appointment = await this.appointmentRepository.findOne({ id });
    appointment.status = AppointmentStatus.Accepted;
    await this.appointmentRepository.save(appointment);
  }

  public async delete(id: string): Promise<void> {
    const appointment = await this.appointmentRepository.findOne({ id });
    await this.appointmentRepository.remove(appointment);
  }

  public async validateAppointmentWithDate(validateAppointmentDto: ValidateAppointmentDto): Promise<boolean> {
    const user = await this.usersService.findByEmail(validateAppointmentDto.emailUser);
    const appoinment = await this.appointmentRepository.findOne({ user })
    const initialRange = validateAppointmentDto.date;
      initialRange.setHours(-1);
      console.log(initialRange + ' inial range');
      const finalRange = validateAppointmentDto.date;
      finalRange.setHours(1);
      console.log(initialRange + ' final range');
    if (appoinment) {
      if (validateAppointmentDto.date < finalRange && validateAppointmentDto.date >= initialRange) {
        return true;
      }
    }
    return false;
  }
}
