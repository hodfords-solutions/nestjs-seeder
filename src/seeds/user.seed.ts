import { factory } from '../../lib/seeder.helper';
import { BaseSeeder } from '../cores/seeders/base.seeder';
import { CountryEntity } from '../entities/country.entity';
import { UserEntity } from '../entities/user.entity';

export class UserSeed extends BaseSeeder {
    async run(): Promise<void> {
        const countryId = (await (await factory(CountryEntity)).saveOne()).id;
        await factory(UserEntity).saveMany(100, { countryId });
    }
}
