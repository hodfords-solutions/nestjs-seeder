import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { TestHelper } from './test.helper.js';
import { UserSeed } from '../src/seeds/user.seed.js';
import { UserEntity } from '../src/entities/user.entity.js';

describe('CountrySeed', () => {
    let testHelper: TestHelper;

    beforeAll(async () => {
        testHelper = new TestHelper();
        await testHelper.initialize();
    });

    afterAll(async () => {
        await testHelper.closeConnection();
    });

    beforeEach(async () => {
        await UserEntity.clear();
    });

    it('should create a country and 100 users', async () => {
        const userSeed = new UserSeed();
        await userSeed.run();

        const users = await UserEntity.find();
        expect(users.length).toBe(100);
    });

    it('should not create duplicate users', async () => {
        const userSeed = new UserSeed();
        await userSeed.run();
        await userSeed.run(); // run twice
        const users = await UserEntity.find();

        const uniqueUsers = new Set(users.map((c) => c.name));
        expect(users.length).toBe(uniqueUsers.size);
    });
});
