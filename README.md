<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

# nestjs-seeder

## Description
Nestjs seeder help you easily seeding fake data to create mocking request API!

## Installation 🤖
```typescript 
npm install @hodfords/nestjs-seeder --save-dev 
```

## Usage ⚡
Let say we want to seed the fake `user` data into our database
Following these 6 steps

### 1. Define the Factory
Define the factory for `UserEntity`

```typescript
// user.factory.ts
import { define } from '@hodfords/nestjs-seeder';

interface SeedUserOptions { countryId: string };

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

### 2. Create the BaseSeeder
Export the abstract class BaseSeeder imported from the library

```typescript
// base.seeder.ts
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

### 3. Create the UserSeed
We need to create a class extending the `BaseSeeder` imported from the library.

**There are 3 methods to seed a fake data from factory method**
1. createOne(options?: any): Entity;
2. saveOne(options?: any): Promise<Entity>;
3. saveMany(count: number, options?: any): Promise<Entity[]>;


```typescript
// user.seed.ts
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

### 4. Create the seedConfig and add the UserSeeder to it
- Import the SeederModule from library
- Import the UserSeed which we just created and add to the array to use later

```typescript
import { SeederModule } from '@hodfords/nestjs-seeder'; 
export const seedConfig = SeederModule.forRoot([UserSeed]);
```

### 5. Import seedConfig into AppModule
```typescript
@Module({
    imports: [seedConfig],
    controllers: [AppController],
    providers: []
})
export class AppModule {}
```
### 6. Run seeder
```typescript
wz-command seeder 
```
