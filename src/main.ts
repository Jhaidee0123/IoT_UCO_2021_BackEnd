import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { mqttConfig } from './mqtt.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true});
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.MQTT,
    options: {
      username: mqttConfig.username,
      password: mqttConfig.password,
      url: mqttConfig.url,
    }
  });
  const swaggerOptions = new DocumentBuilder()
    .setTitle('Iot_UCO_2021_Backend')
    .setDescription('Automated vault with IoT.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup('swagger', app, document);
  await app.startAllMicroservicesAsync();
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
