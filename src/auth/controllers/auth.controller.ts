import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  Get,
} from '@nestjs/common';
import { UserRole } from 'src/users/entities/user-role.enum';
import { RegisterDto } from '../dto';
import { JwtAuthGuard, LocalAuthGuard } from '../guards';
import { AuthService } from '../services';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  public async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('register-power-user')
  public async registerPowerUser(@Body() registrationData: RegisterDto) {
    return this.authService.register({
      ...registrationData,
      role: UserRole.PowerUser,
    });
  }

  @Post('register-manager')
  public async registerManager(@Body() registrationData: RegisterDto) {
    return this.authService.register({
      ...registrationData,
      role: UserRole.Manager,
    });
  }

  @Post('register-user')
  public async registerUser(@Body() registrationData: RegisterDto) {
    return this.authService.register({
      ...registrationData,
      role: UserRole.User,
    });
  }

  @Post('register-watchman')
  public async registerWatchman(@Body() registrationData: RegisterDto) {
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
