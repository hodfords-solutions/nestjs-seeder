import { TypeOrmModule } from '@nestjs/typeorm';
import { CountryEntity } from '../../entities/country.entity';
import { UserEntity } from '../../entities/user.entity';

export const databaseConfig = TypeOrmModule.forRoot({
    type: 'postgres',
    username: 'postgres',
    password: 'postgres',
    database: 'test',
    entities: [CountryEntity, UserEntity],
    synchronize: true,
    migrations: ['../../databases/migrations/*.js']
});
