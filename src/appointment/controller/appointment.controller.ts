import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/role.decorator';
import { JwtAuthGuard } from 'src/auth/guards';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { UserRole } from 'src/users/entities/user-role.enum';
import { CreateAppointmentDto, UpdateAppointmentDto } from '../dto';
import { AppointmentService } from '../services';

@Controller('appointment')
export class AppointmentController {
    constructor(private appointmentService: AppointmentService) { }

    @Roles(UserRole.User)
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Post('create-appointment')
    public async create(@Body() appointment: CreateAppointmentDto) {
        return this.appointmentService.create(appointment);
    }

    @Roles(UserRole.User)
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Put('update-appointment')
    public async update(@Body() appointment: UpdateAppointmentDto) {
        return this.appointmentService.update(appointment);
    }

    @Roles(UserRole.Manager)
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Get('get-all-appointments')
    public async getAll() {
        return this.appointmentService.getAll();
    }

    @Roles(UserRole.Manager)
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Delete('delete-appointment/:id')
    public async delete(@Param('id') id: string) {
        return this.appointmentService.delete(id);
    }

    @Roles(UserRole.Manager)
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Put('reject-appointment/:id')
    public async reject(@Param('id') id: string) {
        return this.appointmentService.rejectAppointment(id);
    }

    @Roles(UserRole.Manager)
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Put('accept-appointment/:id')
    public async accept(@Param('id') id: string) {
        return this.appointmentService.acceptAppointment(id);
    }
}
