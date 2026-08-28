/* eslint-disable max-lines-per-function */
import { Test, TestingModule } from '@nestjs/testing';
import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { SeederCommand } from '../lib/seeder.command.js';
import { SEEDER } from '../lib/seeder.constant.js';
import * as seederHelper from '../lib/seeder.helper.js';

// Mock the seeder helper functions
vi.mock('../lib/seeder.helper.js', () => ({
    scanFactories: vi.fn(),
    runSeeder: vi.fn()
}));

describe('SeederCommand', () => {
    let command: SeederCommand;

    // Mock seeds
    const mockSeeds = [class MockSeed1 {}, class MockSeed2 {}];

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SeederCommand,
                {
                    provide: SEEDER,
                    useValue: mockSeeds
                }
            ]
        }).compile();

        command = module.get<SeederCommand>(SeederCommand);

        // Mock the BaseCommand's program.opts() method
        command['program'] = {
            opts: vi.fn()
        } as any;
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should be defined', () => {
        expect(command).toBeDefined();
    });

    describe('handle', () => {
        it('should run all seeders when no file is specified', async () => {
            // Mock program.opts() to return an empty object
            (command['program'].opts as Mock).mockReturnValue({});

            await command.handle();

            expect(seederHelper.scanFactories).toHaveBeenCalled();
            expect(seederHelper.runSeeder).toHaveBeenCalledTimes(2);
            expect(seederHelper.runSeeder).toHaveBeenCalledWith(mockSeeds[0]);
            expect(seederHelper.runSeeder).toHaveBeenCalledWith(mockSeeds[1]);
        });

        it('should run a specific seeder when file is specified', async () => {
            // Mock program.opts() to return an object with file property
            (command['program'].opts as Mock).mockReturnValue({ file: 'specific-seeder' });

            await command.handle();

            expect(seederHelper.scanFactories).toHaveBeenCalled();
            expect(seederHelper.runSeeder).toHaveBeenCalledTimes(1);
            expect(seederHelper.runSeeder).toHaveBeenCalledWith('specific-seeder');
        });

        it('should call success method after running seeders', async () => {
            // Mock the BaseCommand's program.opts() method
            (command['program'].opts as Mock).mockReturnValue({ file: 'specific-seeder' });
            // Spy on the success method
            const successSpy = vi.spyOn(command, 'success');

            await command.handle();

            expect(successSpy).toHaveBeenCalledWith('Run seeder successfully!');
        });
    });
});
