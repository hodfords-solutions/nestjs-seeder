import { isString } from '@nestjs/common/utils/shared.utils';
import { glob } from 'glob';
import path from 'path';
import { BaseEntity, ObjectType } from 'typeorm';
import { SeederFactory } from './seeder.factory';
import { BaseSeeder } from './base-seeder';

const factories = {};

export function define<Entity>(entity: ObjectType<Entity>, callback: (options: object) => Entity): void {
    factories[entity.toString()] = callback;
}

export function factory<Entity extends BaseEntity>(entity: ObjectType<Entity>): SeederFactory<Entity> {
    return new SeederFactory<Entity>(factories[entity.toString()]);
}

function getListFile(filePattern: string): Promise<string[]> {
    return glob(filePattern, {});
}

export async function scanFactories(): Promise<void> {
    const rootPath = process.cwd();
    let files = await getListFile(path.resolve(`${rootPath}/**/databases/factories/*.factory.ts`));
    if (!files.length) {
        files = await getListFile(path.resolve(`${rootPath}/**/databases/factories/*.factory.js`));
    }
    for (const file of files) {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require(file);
    }
}

export async function runSeeder(seeder: string | (new () => BaseSeeder)): Promise<void> {
    if (isString(seeder)) {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const seed = require(seeder);
        await new seed().run();
    } else {
        await new seeder().run();
    }
}
