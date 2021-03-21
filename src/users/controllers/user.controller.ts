import { Body, Controller, Delete, Get, Param, Put, UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/role.decorator';
import { JwtAuthGuard } from 'src/auth/guards';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { UpdatePinDto, UpdateUserDto } from '../dto';
import { UserRole } from '../entities/user-role.enum';
import { UsersService } from '../services';

@Controller('user')
export class UserController {
    constructor(private userService: UsersService) { }

    @Roles(UserRole.PowerUser)
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Put('update-user')
    public async updateUser(@Body() userToUpdate: UpdateUserDto) {
        return this.userService.updateOrDeactivate(userToUpdate);
    }

    
    @Roles(UserRole.PowerUser.toString(), UserRole.Manager.toString())
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Get('get-all-users')
    public async getAllUsers() {
        return this.userService.findAll();
    }

    
    @Roles(UserRole.PowerUser.toString())
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Delete('delete-user/:email')
    public async deleteUser(@Param('email') email: string) {
        return this.userService.delete(email);
    }

    @Roles(UserRole.Manager.toString(), UserRole.User.toString())
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Put('update-pin')
    public async updatePin(@Body() updatePin: UpdatePinDto) {
        return this.userService.updatePin(updatePin);
    }
}
