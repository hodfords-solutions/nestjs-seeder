import { define } from '../../../lib/seeder.helper';
import { CountryEntity } from '../../entities/country.entity';
import { faker } from '@faker-js/faker';

interface SeedUserOptions {
    name: string;
}

define(CountryEntity, (options: SeedUserOptions) => {
    const country = new CountryEntity();

    country.name = faker.location.country();

    return country;
});
