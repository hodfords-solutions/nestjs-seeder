import { DataSource } from 'typeorm';
import { CountryEntity } from '../src/entities/country.entity';
import { UserEntity } from '../src/entities/user.entity';
import { CreateCountryTable1637223647945 } from '../src/databases/migrations/1637223647945-create-country-table.migration';
import { CreateUserTable1637223647946 } from '../src/databases/migrations/1637223647946-create-user-table.migration';

export class TestHelper {
    private dataSource: DataSource;

    async initialize() {
        await this.createConnection();
        await this.clearDatabase();
        this.requireFactories();
    }

    private requireFactories() {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require('../src/databases/factories/country.factory');
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require('../src/databases/factories/user.factory');
    }

    private async createConnection(): Promise<void> {
        this.dataSource = new DataSource({
            type: 'postgres',
            port: 5432,
            username: 'postgres',
            password: 'postgres',
            database: 'test',
            entities: [CountryEntity, UserEntity],
            migrations: [CreateCountryTable1637223647945, CreateUserTable1637223647946],
            migrationsRun: true
        });

        await this.dataSource
            .initialize()
            .then(() => {
                console.log('Data Source has been initialized!');
            })
            .catch((err) => {
                console.error('Error during Data Source initialization', err);
            });

        CountryEntity.useDataSource(this.dataSource);
        UserEntity.useDataSource(this.dataSource);
    }

    private async clearDatabase(): Promise<void> {
        await UserEntity.delete({});
        await CountryEntity.delete({});
    }

    async closeConnection(): Promise<void> {
        await this.dataSource.destroy();
    }
}
