import { UserRole } from '../entities/user-role.enum';

export class CreateUserDto {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: UserRole;
}
