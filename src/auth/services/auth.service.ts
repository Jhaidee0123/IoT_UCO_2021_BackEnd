import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { hash, compare } from 'bcrypt';
import { PostgresErrorCode } from 'src/database';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from '../dto';
import { UsersService } from 'src/users/services';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  public async register(registrationData: RegisterDto): Promise<void> {
    const hashedPassword = await hash(registrationData.password, 10);
    try {
      await this.usersService.create({
        ...registrationData,
        password: hashedPassword,
      });
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException(
          'User with that email address already exists.',
          HttpStatus.CONFLICT,
        );
      }
      throw new HttpException(
        'Something went wrong.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async validateUser(email: string, password: string): Promise<any> {
    try {
      const user = await this.usersService.findByEmail(email);
      if (user) {
        const passwordMatch = await compare(password, user.password);
        if (!passwordMatch) {
          throw new HttpException(
            'Wrong credentials provided.',
            HttpStatus.BAD_REQUEST,
          );
        }
        return user;
      }
    } catch (error) {
      throw new HttpException(
        'Wrong credentials provided.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
