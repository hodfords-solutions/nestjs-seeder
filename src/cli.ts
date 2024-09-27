import { NestFactory } from '@nestjs/core';
import { CommandService } from '@hodfords/nestjs-command';
import { AppModule } from './app.module';
import { commandConfig } from './cores/configs/command.config';

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create(AppModule);
    const commandService: CommandService = app.select(commandConfig).get(CommandService, { strict: true });
    await commandService.exec();
    await app.close();
}

bootstrap();
