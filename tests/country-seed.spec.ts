import { CountrySeed } from '../src/seeds/country.seed';
import { CountryEntity } from '../src/entities/country.entity';
import { TestHelper } from './test.helper';

describe('CountrySeed', () => {
    let testHelper: TestHelper;

    beforeAll(async () => {
        testHelper = new TestHelper();
        await testHelper.initialize();
    });

    afterAll(async () => {
        await testHelper.closeConnection();
    });

    it('should create a country', async () => {
        const countrySeed = new CountrySeed();
        await countrySeed.run();

        const countries = await CountryEntity.find();
        expect(countries.length).toBeGreaterThan(0);

        const country = countries[0];
        expect(country).toHaveProperty('id');
        expect(country).toHaveProperty('name');
    });

    it('should not create duplicate countries', async () => {
        const countrySeed = new CountrySeed();
        await countrySeed.run();
        await countrySeed.run(); // Run twice

        const countries = await CountryEntity.find();

        const uniqueCountries = new Set(countries.map((c) => c.name));
        expect(countries.length).toBe(uniqueCountries.size);
    });
});
