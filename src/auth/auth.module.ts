import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { JwtStrategy, LocalStrategy } from './strategies';
import { AuthService } from './services';
import { AuthController } from './controllers';
import { JwtAuthGuard } from './guards';
import { RoleGuard } from './guards/role.guard';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '10000s' },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, RoleGuard, JwtAuthGuard],
  controllers: [AuthController],
})
export class AuthModule {}
