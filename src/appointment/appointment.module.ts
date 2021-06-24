import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { VaultModule } from 'src/vault/vault.module';
import { AppointmentController } from './controller/appointment.controller';
import { Appointment } from './entities/appointment.entity';
import { AppointmentService } from './services';

@Module({
  imports: [UsersModule, VaultModule, TypeOrmModule.forFeature([Appointment])],
  providers: [AppointmentService],
  exports: [AppointmentService],
  controllers: [AppointmentController]
})
export class AppointmentModule {}
