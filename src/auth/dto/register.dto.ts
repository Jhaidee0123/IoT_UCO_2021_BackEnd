import { UserRole } from 'src/users/entities/user-role.enum';

export class RegisterDto {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: UserRole;
}
