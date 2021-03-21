import { UserRole } from "../entities/user-role.enum";

export class UpdateUserDto {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    role: UserRole;
}