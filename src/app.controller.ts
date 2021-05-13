import { AzureStorageFileInterceptor, AzureStorageService, UploadedFileMetadata } from '@nestjs/azure-storage';
import { Controller, Post, UploadedFile, UseGuards, UseInterceptors, Request, HttpService, Body, HttpStatus, Inject, HttpException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from './auth/decorators/role.decorator';
import { JwtAuthGuard } from './auth/guards';
import { RoleGuard } from './auth/guards/role.guard';
import { UserRole } from './users/entities/user-role.enum';
import { UsersService } from './users/services';
import { map } from 'rxjs/operators'
import { ClientProxy } from '@nestjs/microservices';
import { AppointmentService } from './appointment/services';
import { ValidateAppointmentDto } from './appointment/dto/validate-appointment.dto';

@Controller()
export class AppController {
    constructor(private readonly azure: AzureStorageService,
                private readonly userService: UsersService,
                private readonly httpService: HttpService,
                private readonly appointmentService: AppointmentService,
                @Inject('VAULT_SERVICE') private client: ClientProxy) {
       
        
    }

    @Roles(UserRole.PowerUser, UserRole.Manager)
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Post("upload-face-image")
    @UseInterceptors(FileInterceptor("photo"))
    async uploadFaceImage(@UploadedFile() file, @Request() req) {
        file = {
            ...file,
            originalname: req.user.id
        }
        const imageRoute = await this.azure.upload(file);
        this.userService.setImageToUser(imageRoute, req.user.email);
        this.httpService.post('http://localhost:5000/Face/train', { email: req.user.email, registerUserPhotoUrl: imageRoute })
            .toPromise().then()
            .catch((err) => console.log(err));
        return;
    }

    @Roles(UserRole.PowerUser, UserRole.Manager)
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Post("validate-face-image")
    @UseInterceptors(FileInterceptor("photo"))
    async validateFaceImage(@UploadedFile() file, @Body() body, @Request() req) {
        const imageRoute = await this.azure.upload(file);
        const user = await this.userService.findByEmail(req.user.email);
        if (user.pin != body.pin) {
            throw new HttpException(
                'PIN Inválido',
                HttpStatus.UNAUTHORIZED,
              );
        }
        await this.httpService.post('http://localhost:5000/Face/validate-face', { url: imageRoute })
            .pipe(
                map(async response => {
                    if (response.data) {
                        const appointmentDto: ValidateAppointmentDto = {
                            date: new Date(),
                            emailUser: req.user.email
                        }
                        const validation = await this.appointmentService.validateAppointmentWithDate(appointmentDto);
                        console.log('la validacion es: ' + validation);
                        if (validation) {
                            this.client.emit<string>('opendoor', req.user.email);
                            return response.data;
                        } 
                        throw new HttpException(
                            'No hay ninguna cita activa',
                            HttpStatus.NOT_FOUND,
                            );
                    } 
                })
            ).toPromise().catch((err) => {
                if (err.response.status === 401) {
                    throw new HttpException(
                        err.response.data,
                        HttpStatus.UNAUTHORIZED,
                      );
                }
            });
        return;
    }

    
    @Roles(UserRole.Manager, UserRole.PowerUser)
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Post('close-door')
    public async openDoor(@Request() req) {
        return this.client.emit<string>('closedoor', req.user.email);
    }
}
