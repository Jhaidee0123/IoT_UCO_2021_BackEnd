import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { UserInfoDoorDto } from './appointment/dto';

@Controller()
export class AppController {

    constructor(@Inject('VAULT_SERVICE') private client: ClientProxy) { } 

    @Post('open-door')
    public async openDoor(@Body() userInfo: UserInfoDoorDto) {
        return this.client.emit<string>('opendoor', userInfo.email);
    }
}
