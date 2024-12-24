import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({});
  const config = new DocumentBuilder()
    .addBearerAuth(undefined, 'token')
    .addApiKey(undefined, 'api-key')
    .setTitle('Blog API')
    .setDescription('API Documentation for Blog Application')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
  

  await app.listen(5000);
  console.info(`Application Swagger: ${await app.getUrl()}/swagger`);
}
bootstrap();
