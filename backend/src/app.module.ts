import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from './media/entities/media.entity.js';
import { MediaModule } from './media/media.module.js';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),

		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => ({
				type: 'postgres',
				host: configService.get('DB_HOST', 'localhost'),
				port: configService.get<number>('DB_PORT', 5432),
				username: configService.get('DB_USERNAME', 'postgres'),
				password: configService.get('DB_PASSWORD', 'postgres'),
				database: configService.get('DB_DATABASE', 'extract-audio-app'),
				entities: [Media],
				logging: true,
			}),
			inject: [ConfigService],
		}),

		MediaModule,
	],
})
export class AppModule {}
