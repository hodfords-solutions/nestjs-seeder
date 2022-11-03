import { BaseEntity, ObjectType } from 'typeorm';
import { SeederFactory } from './seeder.factory';
import { glob } from 'glob';
import { isString } from '@nestjs/common/utils/shared.utils';
import path from 'path';

const factories = {};

export function define<Entity>(entity: ObjectType<Entity>, callback: (options: any) => Entity) {
    factories[entity.toString()] = callback;
}

export function factory<Entity extends BaseEntity>(entity: ObjectType<Entity>) {
    return new SeederFactory<Entity>(factories[entity.toString()]);
}

function getListFile(filePattern): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
        new glob.Glob(filePattern, {}, (error, files) => {
            if (error) {
                reject(error);
            } else {
                try {
                    resolve(files);
                } catch (e) {
                    reject(e);
                }
            }
        });
    });
}

export async function scanFactories() {
    let rootPath = process.cwd();
    let files = await getListFile(path.resolve(`${rootPath}/**/databases/factories/*.factory.ts`));
    if (!files.length) {
        files = await getListFile(path.resolve(`${rootPath}/**/databases/factories/*.factory.js`));
    }
    for (let file of files) {
        require(file);
    }
}

export async function runSeeder(seeder) {
    if (isString(seeder)) {
        let seed = require(seeder);
        await new seed().run();
    } else {
        await new seeder().run();
    }
}
