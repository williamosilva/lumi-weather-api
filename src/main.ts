import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Weather API')
    .setDescription(
      'API para consulta de dados meteorológicos usando OpenWeather',
    )
    .setVersion('1.0')
    .addTag('weather', 'Operação relacionada ao clima')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'Weather API - Documentação',
    customCssUrl: '/swagger-ui-custom.css',
  });

  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);

  console.log(
    `Aplicação rodando em: http://localhost:${process.env.PORT ?? 3000}`,
  );
  console.log(
    `Documentação Swagger: http://localhost:${process.env.PORT ?? 3000}/api/docs`,
  );
}

bootstrap();
