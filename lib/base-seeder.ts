import { Type } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

export abstract class BaseSeeder {
    static module: TestingModule;

    async createModule(): Promise<TestingModule> {
        return Test.createTestingModule({
            imports: []
        }).compile();
    }

    async getService<T>(service: Type<T>): Promise<T> {
        if (!BaseSeeder.module) {
            BaseSeeder.module = await this.createModule();
        }
        return BaseSeeder.module.resolve(service);
    }

    abstract run(): Promise<void>;
}
