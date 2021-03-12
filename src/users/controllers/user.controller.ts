import { Body, Controller, Param, Put, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from 'src/auth/guards';
import { UpdateUserDto, UserDto } from '../dto/user.dto';
import { UsersService } from '../services';

@Controller('user')
export class UserController {
    constructor(private userService: UsersService) { }

    //@UseGuards(LocalAuthGuard)
    @Put('update-user')
    public async updateUser(@Body() userToUpdate: UserDto) {
        return this.userService.updateOrDeactivate(userToUpdate);
    }
}
