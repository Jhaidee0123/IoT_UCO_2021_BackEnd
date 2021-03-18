import { Body, Controller, Delete, Get, Param, Put, UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/role.decorator';
import { JwtAuthGuard } from 'src/auth/guards';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { UpdateUserDto } from '../dto';
import { UsersService } from '../services';

@Controller('user')
export class UserController {
    constructor(private userService: UsersService) { }

    @Roles('0')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Put('update-user')
    public async updateUser(@Body() userToUpdate: UpdateUserDto) {
        return this.userService.updateOrDeactivate(userToUpdate);
    }

    
    @Roles('0', '1')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Get('get-all-users')
    public async getAllUsers() {
        return this.userService.findAll();
    }

    
    @Roles('0')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Delete('delete-user/:email')
    public async deleteUser(@Param('email') email: string) {
        return this.userService.delete(email);
    }
}
