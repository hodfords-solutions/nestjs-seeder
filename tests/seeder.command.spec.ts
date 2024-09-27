/* eslint-disable max-lines-per-function */
import { Test, TestingModule } from '@nestjs/testing';
import { SeederCommand } from '../lib/seeder.command';
import { SEEDER } from '../lib/seeder.constant';
import * as seederHelper from '../lib/seeder.helper';

// Mock the seeder helper functions
jest.mock('../lib/seeder.helper', () => ({
    scanFactories: jest.fn(),
    runSeeder: jest.fn()
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
            opts: jest.fn()
        } as any;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(command).toBeDefined();
    });

    describe('handle', () => {
        it('should run all seeders when no file is specified', async () => {
            // Mock program.opts() to return an empty object
            (command['program'].opts as jest.Mock).mockReturnValue({});

            await command.handle();

            expect(seederHelper.scanFactories).toHaveBeenCalled();
            expect(seederHelper.runSeeder).toHaveBeenCalledTimes(2);
            expect(seederHelper.runSeeder).toHaveBeenCalledWith(mockSeeds[0]);
            expect(seederHelper.runSeeder).toHaveBeenCalledWith(mockSeeds[1]);
        });

        it('should run a specific seeder when file is specified', async () => {
            // Mock program.opts() to return an object with file property
            (command['program'].opts as jest.Mock).mockReturnValue({ file: 'specific-seeder' });

            await command.handle();

            expect(seederHelper.scanFactories).toHaveBeenCalled();
            expect(seederHelper.runSeeder).toHaveBeenCalledTimes(1);
            expect(seederHelper.runSeeder).toHaveBeenCalledWith('specific-seeder');
        });

        it('should call success method after running seeders', async () => {
            // Mock the BaseCommand's program.opts() method
            (command['program'].opts as jest.Mock).mockReturnValue({ file: 'specific-seeder' });
            // Spy on the success method
            const successSpy = jest.spyOn(command, 'success');

            await command.handle();

            expect(successSpy).toHaveBeenCalledWith('Run seeder successfully!');
        });
    });
});
