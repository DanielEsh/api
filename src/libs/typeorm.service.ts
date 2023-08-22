import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  @Inject(ConfigService)
  private readonly config: ConfigService;

  public createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.config.get<string>('POSTGRES_HOST'),
      port: this.config.get<number>('POSTGRES_PORT'),
      database: this.config.get<string>('POSTGRES_NAME'),
      username: this.config.get<string>('POSTGRES_USER'),
      password: this.config.get<string>('POSTGRES_PASSWORD'),
      entities: ['dist/**/*.entity.{ts,js}'],
      migrations: ['dist/migrations/*.{ts,js}'],
      migrationsTableName: 'typeorm_migrations',
      logger: 'file',
      synchronize: true, // never use TRUE in production!
    };
  }
}

/**
 * curl -X POST http://localhost:8000/api/auth/register -H "Content-Type: application/json" -d '{"name": "Elon Musk", "email": "elon@gmail.com", "password": "12345678"}'
 * curl -X POST http://localhost:8000/auth/login -H "Content-Type: application/json" -d '{"email": "elon@gmail.com", "password": "12345678"}'
 * eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJlbG9uQGdtYWlsLmNvbSIsImlhdCI6MTY1Njc3MjY2NywiZXhwIjoxNjg4MzA4NjY3fQ.pgt0Xe7RTOubvgh7LjK-_siSCs3Oye3ZrW6AmlxFDJs
 *
 * curl -X POST http://localhost:8000/auth/refresh -H "Content-Type: application/json" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJlbG9uQGdtYWlsLmNvbSIsImlhdCI6MTY1Njc3MjY2NywiZXhwIjoxNjg4MzA4NjY3fQ.pgt0Xe7RTOubvgh7LjK-_siSCs3Oye3ZrW6AmlxFDJs"
 * curl -X PUT http://localhost:8000/user/name -H "Content-Type: application/json" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJlbG9uQGdtYWlsLmNvbSIsImlhdCI6MTY1Njc3MjY2NywiZXhwIjoxNjg4MzA4NjY3fQ.pgt0Xe7RTOubvgh7LjK-_siSCs3Oye3ZrW6AmlxFDJs" -d '{"name": "Super Elon"}'
 */
