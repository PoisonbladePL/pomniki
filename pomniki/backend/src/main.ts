import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // Tworzenie instancji aplikacji NestJS
  // Importowanie modułu głównego aplikacji
  const app = await NestFactory.create(AppModule);
  
  // Włącz CORS - ważne dla komunikacji z frontendem
  // Ustawienie adresu frontendu React
  app.enableCors({
    origin: 'http://localhost:3001', // Adres frontendu React
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // (opcjonalnie) prosty logger żądań
  app.use((req, _res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });

  // Uruchomienie aplikacji na porcie 3000
  // Aplikacja będzie dostępna pod adresem http://localhost:3000
  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();