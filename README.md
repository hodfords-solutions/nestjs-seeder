<p align="center">
  <a href="http://opensource.hodfords.uk" target="blank"><img src="https://opensource.hodfords.uk/img/logo.svg" width="320" alt="Hodfords Logo" /></a>
</p>

<p align="center"> <b>nestjs-seeder</b> streamlines the process of populating your NestJS application with mock data. It makes it easy to generate and manage seed data, ideal for testing and simulating API responses.</p>

## Installation 🤖

Install the `nestjs-seeder` package with:

```
npm install @hodfords/nestjs-seeder --save
```

## Usage 🚀

To seed fake user data into your database, follow these 6 steps:

#### 1. Define the Factory

First, create a factory for UserEntity. This factory will generate fake data for user records.

##### user.factory.ts

```typescript
import { define } from '@hodfords/nestjs-seeder';

interface SeedUserOptions {
    countryId: string;
}

class UserEntity {
    name: string;
    age: string;
    countryId: string;
    createdAt: Date;
}

define(UserEntity, (options: SeedUserOptions) => {
    const user = new UserEntity();

    user.name = faker.name.title();
    user.age = faker.datatype.number(100);
    user.createdAt = faker.date.future();

    return plainToClassFromExist(user, options || {});
});
```

#### 2. Create the BaseSeeder

Create a base seeder class that will be used to configure and run your seeding logic.

##### base.seeder.ts

```typescript
import { Test } from '@nestjs/testing';
import { AppModule } from '~app.module';
import { databaseConfig } from '~config/database.config';
import { BaseSeeder as AbstractSeeder } from '@hodfords/nestjs-seeder';

export abstract class BaseSeeder extends AbstractSeeder {
    createModule() {
        return Test.createTestingModule({
            imports: [AppModule, databaseConfig]
        }).compile();
    }

    abstract run(): Promise<void>;
}
```

#### 3. Create the UserSeed

Implement a seeder class that extends BaseSeeder. Use the factory methods to generate and save data.

**There are 3 methods to seed a fake data from factory method**

```typescript
createOne(options?: any): Entity;
saveOne(options?: any): Promise<Entity>;
saveMany(count: number, options?: any): Promise<Entity[]>;
```

##### user.seed.ts

```typescript
import { BaseSeeder } from '~core/seeders/base-seeder';
import { factory } from '@hodfords/nestjs-seeder';
import faker from 'faker';

export class UserSeed extends BaseSeeder {
    async run() {
        const countryId = (await factory(CountryEntity)).id;

        await factory(UserEntity).saveOne({ countryId }); // 1
        factory(UserEntity).createOne({ countryId }); // 2
        await factory(UserEntity).saveMany(100, { countryId }); // 3
    }
}
```

#### 4. Create the seedConfig

Set up the seed configuration to include your seed classes.

```typescript
import { SeederModule } from '@hodfords/nestjs-seeder';
export const seedConfig = SeederModule.forRoot([UserSeed]);
```

#### 5. Import seedConfig into AppModule

Integrate the seed configuration into your main application module.

```typescript
@Module({
    imports: [seedConfig],
    controllers: [AppController],
    providers: []
})
export class AppModule {}
```

#### 6. Run the seeder

Execute the seeder command to populate your database with the defined fake data.

```typescript
wz-command seeder
```

## License 📝

This project is licensed under the MIT License
