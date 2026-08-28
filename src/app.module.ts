import { Module } from '@nestjs/common';
import { SeederModule } from '../lib/seeder.module.js';
import { CountrySeed } from './seeds/country.seed.js';
import { UserSeed } from './seeds/user.seed.js';
import { commandConfig } from './cores/configs/command.config.js';
import { databaseConfig } from './cores/configs/database.config.js';

const seederConfig = SeederModule.forRoot([CountrySeed, UserSeed]);

@Module({
    imports: [seederConfig, commandConfig, databaseConfig],
    controllers: [],
    providers: []
})
export class AppModule {}
