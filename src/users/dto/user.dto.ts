import { UserRole } from '../entities/user-role.enum';

export class UserDto {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: UserRole;
}

export interface CreateUserDto extends UserDto { }

export interface UpdateUserDto extends UserDto { }
