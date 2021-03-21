import { UserRole } from 'src/users/entities/user-role.enum';
import { IsEmail, IsNotEmpty, Length, Validate } from 'class-validator';
import { PasswordValidator } from './validators/password-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @Validate(PasswordValidator)
  @Length(8, 12, { message: "La contraseña debe tener mínimo 8 caracteres y máximo 12 caracteres" })
  password: string;
  role: UserRole;
}
