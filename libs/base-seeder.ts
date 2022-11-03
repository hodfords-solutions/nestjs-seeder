import {Test, TestingModule} from '@nestjs/testing';
import {Type} from '@nestjs/common';

export abstract class BaseSeeder {
    static module: TestingModule;

    async createModule() {
        return await Test.createTestingModule({
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
