import { BaseCommand, Command } from '@hodfords/nestjs-command';
import { Inject, Injectable } from '@nestjs/common';
import { SEEDER } from './seeder.constant';
import { runSeeder, scanFactories } from './seeder.helper';
import { BaseSeeder } from './base-seeder';

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
    constructor(@Inject(SEEDER) private seeds: (new () => BaseSeeder)[]) {
        super();
    }

    async handle(): Promise<void> {
        const { file } = this.program.opts();
        await scanFactories();
        if (file) {
            await runSeeder(file);
        } else {
            for (const seed of this.seeds) {
                await runSeeder(seed);
            }
        }
        this.success(`Run seeder successfully!`);
    }
}
