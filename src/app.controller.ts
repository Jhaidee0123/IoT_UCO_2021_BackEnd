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

@Controller()
export class AppController {
    constructor(private readonly azure: AzureStorageService,
                private readonly userService: UsersService,
                private readonly httpService: HttpService,
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
        this.httpService.post('http://localhost:5000/WeatherForecast/train', { email: req.user.email, registerUserPhotoUrl: imageRoute })
            .toPromise().then((res) => console.log(res))
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
            console.log('entro por aca');
            throw new HttpException(
                'PIN Invalido',
                HttpStatus.UNAUTHORIZED,
              );
        }
        return await this.httpService.post('http://localhost:5000/WeatherForecast/validate-face', { url: imageRoute })
            .pipe(
                map(response => {
                    if (response.data) {
                        this.client.emit<string>('opendoor', req.user.email);
                        return response.data;
                    } 
                })
            );
    }

    
    @Roles(UserRole.Manager, UserRole.PowerUser)
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Post('close-door')
    public async openDoor(@Request() req) {
        return this.client.emit<string>('closedoor', req.user.email);
    }
}
