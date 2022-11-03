import { Inject, Injectable } from '@nestjs/common';
import { runSeeder, scanFactories } from './seeder.helper';
import { BaseCommand, Command } from '@hodfords/nestjs-command';
import { SEEDER } from './seeder.constant';

@Command({
    signature: 'seeder',
    description: 'Run seeder',
    options: [
        {
            value: '--file <file>',
            description: 'Module'
        }
    ]
})
@Injectable()
export class SeederCommand extends BaseCommand {
    constructor(
        @Inject(SEEDER) private seeds: any
    ) {
        super();
    }

    async handle() {
        const { file } = this.program.opts();
        await scanFactories();
        if (file) {
            await runSeeder(file);
        } else {
            for (let seed of this.seeds) {
                await runSeeder(seed);
            }
        }
        this.success(`Run seeder successfully!`);
    }
}
