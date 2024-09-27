import { BaseSeeder } from '../cores/seeders/base.seeder';
import { factory } from '../../lib/seeder.helper';
import { CountryEntity } from '../entities/country.entity';
import { faker } from '@faker-js/faker';

export class CountrySeed extends BaseSeeder {
    async run(): Promise<void> {
        await factory(CountryEntity).saveOne({ name: faker.location.country() });
    }
}
