import { factory } from '../../lib/seeder.helper.js';
import { BaseSeeder } from '../cores/seeders/base.seeder.js';
import { CountryEntity } from '../entities/country.entity.js';
import { UserEntity } from '../entities/user.entity.js';

export class UserSeed extends BaseSeeder {
    async run(): Promise<void> {
        const countryId = (await (await factory(CountryEntity)).saveOne()).id;
        await factory(UserEntity).saveMany(100, { countryId });
    }
}
