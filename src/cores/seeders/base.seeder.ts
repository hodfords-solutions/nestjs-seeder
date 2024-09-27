import { Test } from '@nestjs/testing';
import { BaseSeeder as AbstractSeeder } from '../../../lib/base-seeder';

export abstract class BaseSeeder extends AbstractSeeder {
    createModule() {
        return Test.createTestingModule({
            imports: []
        }).compile();
    }

    abstract run(): Promise<void>;
}
