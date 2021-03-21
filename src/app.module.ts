import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AppointmentController } from './appointment/controller/appointment.controller';
import { Appointment } from './appointment/entities/appointment.entity';
import { AppointmentModule } from './appointment/appointment.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    AppointmentModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: Number(process.env.DATABASE_PORT) || 5432,
      username: process.env.DATABASE_USER || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'sa',
      database: process.env.DATABASE_NAME || 'VaultIoT',
      synchronize: true,
      entities: ['dist/**/*.entity.{js,ts}'],
      logging: true,
    })
  ],
  controllers: [AppController, AppointmentController],
  providers: [AppService],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
