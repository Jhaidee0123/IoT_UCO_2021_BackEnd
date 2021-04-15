import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities';
import { UsersService } from './services';
import { UserController } from './controllers/user.controller';
import { ClientProxyFactory, ClientsModule, Transport } from '@nestjs/microservices';
import { mqttConfig } from 'src/mqtt.config';
import { AppModule } from 'src/app.module';
import { AzureStorageModule } from '@nestjs/azure-storage';
import { azureConfig } from 'src/azureConfig';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService,
  {
    provide: 'VAULT_SERVICE',
    useFactory: () => {
      return ClientProxyFactory.create({
        transport: Transport.MQTT,
        options: {
          username: mqttConfig.username,
          password: mqttConfig.password,
          url: mqttConfig.url,
        }
      })
    },
    inject: [UsersService]
  }],
  exports: [UsersService],
  controllers: [UserController]
})
export class UsersModule {}
