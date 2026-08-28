import { BaseSeeder } from '../cores/seeders/base.seeder.js';
import { factory } from '../../lib/seeder.helper.js';
import { CountryEntity } from '../entities/country.entity.js';
import { faker } from '@faker-js/faker';

export class CountrySeed extends BaseSeeder {
    async run(): Promise<void> {
        await factory(CountryEntity).saveOne({ name: faker.location.country() });
    }
}
