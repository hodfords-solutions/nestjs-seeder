import { UserEntity } from '../../entities/user.entity.js';
import { faker } from '@faker-js/faker';
import { define } from '../../../lib/seeder.helper.js';

interface SeedUserOptions {
    countryId: string;
}

define(UserEntity, (options: SeedUserOptions) => {
    const user = new UserEntity();

    user.name = faker.person.fullName();
    user.email = faker.internet.email();
    user.id = faker.string.uuid();
    user.countryId = options.countryId;

    return user;
});
