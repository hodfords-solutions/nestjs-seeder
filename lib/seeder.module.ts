import { DynamicModule, Module, ValueProvider } from '@nestjs/common';
import { SeederCommand } from './seeder.command.js';
import { SEEDER } from './seeder.constant.js';

@Module({
    providers: [SeederCommand],
    exports: [],
    imports: []
})
export class SeederModule {
    public static forRoot(options: object): DynamicModule {
        const seederProvider: ValueProvider<object> = {
            provide: SEEDER,
            useValue: options
        };

        return {
            imports: [],
            module: SeederModule,
            providers: [seederProvider, SeederCommand],
            exports: []
        };
    }
}
