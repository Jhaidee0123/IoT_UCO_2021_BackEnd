import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as moment from 'moment';
import { UsersService } from "src/users/services";
import { VaultService } from "src/vault/services/vault.service";
import { Repository } from "typeorm";
import { CreateAppointmentDto, UpdateAppointmentDto } from "../dto";
import { ValidateAppointmentDto } from "../dto/validate-appointment.dto";
import { Appointment } from "../entities/appointment.entity";
import { AppointmentStatus } from "../entities/appointment.enum";

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment) private appointmentRepository: Repository<Appointment>,
    private usersService: UsersService,
    private vaultService: VaultService
  ) {}

  public async create(appointment: CreateAppointmentDto): Promise<void> {
    const user = await this.usersService.findById(appointment.userId);
    const newAppointment = await this.appointmentRepository.create(appointment);
    newAppointment.user = user;
    await this.appointmentRepository.save(newAppointment);
  }

  public async getAll(): Promise<Appointment[]> {
    return await this.appointmentRepository.find({ relations: ['user'], where: [{ status: AppointmentStatus.Pending }, { status: AppointmentStatus.Accepted }]});
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

  public async completeAppointment(id: string): Promise<void> {
    const appointment = await this.appointmentRepository.findOne({ id });
    appointment.status = AppointmentStatus.Completed;
    await this.appointmentRepository.save(appointment);
  }

  public async delete(id: string): Promise<void> {
    const appointment = await this.appointmentRepository.findOne({ id });
    await this.appointmentRepository.remove(appointment);
  }

  public async validateAppointmentWithDate(validateAppointmentDto: ValidateAppointmentDto): Promise<boolean> {
    const user = await this.usersService.findByEmail(validateAppointmentDto.emailUser);
    const vaultState = await this.vaultService.getVault();
    if (!vaultState[0].isOpen) {
      throw new HttpException(
        'La boveda no se encuentra aún abierta. Contacte con el manager',
        HttpStatus.BAD_REQUEST,
        );
    }
    const appoinment = await this.appointmentRepository.findOne({ where: { status: AppointmentStatus.Accepted, user: user } })
    if (appoinment === undefined) {
      throw new HttpException(
        'No hay ninguna cita activa',
        HttpStatus.NOT_FOUND,
        );
    }
    
    const initialRange = validateAppointmentDto.date;
    const finalRange = moment(initialRange).add(1, 'hours').toDate();
    if (appoinment) {
      if (moment(initialRange).toDate() > appoinment.date && appoinment.date < finalRange) {
        return true;
      }
      else {
        moment.locale('es');
        throw new HttpException(
          'No se encuentra en la hora solicitada. Su cita es en ' +  moment(appoinment.date).format('MMMM Do YYYY, h:mm:ss a'),
          HttpStatus.BAD_REQUEST,
          );
      }
    }
    return false;
  }
}
