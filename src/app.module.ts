import { Module } from '@nestjs/common';
import { SeederModule } from '../lib/seeder.module';
import { CountrySeed } from './seeds/country.seed';
import { UserSeed } from './seeds/user.seed';
import { commandConfig } from './cores/configs/command.config';
import { databaseConfig } from './cores/configs/database.config';

const seederConfig = SeederModule.forRoot([CountrySeed, UserSeed]);

@Module({
    imports: [seederConfig, commandConfig, databaseConfig],
    controllers: [],
    providers: []
})
export class AppModule {}
