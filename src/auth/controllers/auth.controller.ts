import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  Get,
  ValidationPipe
} from '@nestjs/common';
import { UserRole } from 'src/users/entities/user-role.enum';
import { Roles } from '../decorators/role.decorator';
import { RegisterDto } from '../dto';
import { JwtAuthGuard, LocalAuthGuard } from '../guards';
import { RoleGuard } from '../guards/role.guard';
import { AuthService } from '../services';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  public async login(@Body() req) {
    return this.authService.login(req.user);
  }

  @Post('register-power-user')
  /* @Roles(UserRole.PowerUser.toString())
  @UseGuards(JwtAuthGuard, RoleGuard) */
  public async registerPowerUser(@Body(new ValidationPipe()) registrationData: RegisterDto) {
    return this.authService.register({
      ...registrationData,
      role: UserRole.PowerUser,
    });
  }

  @Post('register-manager')
  @Roles(UserRole.PowerUser.toString())
  @UseGuards(JwtAuthGuard, RoleGuard)
  public async registerManager(@Body(new ValidationPipe()) registrationData: RegisterDto) {
    return this.authService.register({
      ...registrationData,
      role: UserRole.Manager,
    });
  }

  @Post('register-user')
  @Roles(UserRole.Manager.toString())
  @UseGuards(JwtAuthGuard, RoleGuard)
  public async registerUser(@Body(new ValidationPipe()) registrationData: RegisterDto) {
    return this.authService.register({
      ...registrationData,
      role: UserRole.User,
    });
  }

  @Post('register-watchman')
  @Roles(UserRole.Manager.toString())
  @UseGuards(JwtAuthGuard, RoleGuard)
  public async registerWatchman(@Body(new ValidationPipe()) registrationData: RegisterDto) {
    return this.authService.register({
      ...registrationData,
      role: UserRole.Watchman,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  public getProfile(@Request() req) {
    return req.user;
  }
}
