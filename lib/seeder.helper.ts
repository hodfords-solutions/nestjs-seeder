import { isString } from '@nestjs/common/utils/shared.utils.js';
import { glob } from 'glob';
import path from 'path';
import { pathToFileURL } from 'url';
import { BaseEntity, ObjectType } from 'typeorm';
import { SeederFactory } from './seeder.factory.js';
import { BaseSeeder } from './base-seeder.js';

/** Factory callbacks are stored with their options type erased; `define`/`factory` re-apply it. */
const factories: Record<string, (options?: object) => unknown> = {};

export function define<Entity, Options extends object = object>(
    entity: ObjectType<Entity>,
    callback: (options: Options) => Entity
): void {
    factories[entity.toString()] = callback as (options?: object) => unknown;
}

export function factory<Entity extends BaseEntity>(entity: ObjectType<Entity>): SeederFactory<Entity> {
    return new SeederFactory<Entity>(factories[entity.toString()] as (options?: object) => Entity);
}

function getListFile(filePattern: string): Promise<string[]> {
    return glob(filePattern, {});
}

/**
 * Turn a file path (or a bare package specifier) into something `import()` accepts.
 * ESM `import()` requires a URL for absolute/relative filesystem paths.
 */
function toImportSpecifier(target: string): string {
    if (/^[a-z][a-z0-9+.-]*:/i.test(target)) {
        return target;
    }
    if (path.isAbsolute(target) || target.startsWith('.')) {
        return pathToFileURL(path.resolve(target)).href;
    }
    return target;
}

/**
 * Resolve the seeder class out of an ES module namespace:
 * prefer the default export, otherwise fall back to the first exported class.
 */
function resolveSeederClass(module: Record<string, unknown>): new () => BaseSeeder {
    const candidate = module.default ?? Object.values(module).find((value) => typeof value === 'function');
    if (typeof candidate !== 'function') {
        throw new Error('The seeder module does not export a seeder class');
    }

    return candidate as new () => BaseSeeder;
}

export async function scanFactories(): Promise<void> {
    const rootPath = process.cwd();
    let files = await getListFile(path.resolve(`${rootPath}/**/databases/factories/*.factory.ts`));
    if (!files.length) {
        files = await getListFile(path.resolve(`${rootPath}/**/databases/factories/*.factory.js`));
    }
    for (const file of files) {
        await import(toImportSpecifier(file));
    }
}

export async function runSeeder(seeder: string | (new () => BaseSeeder)): Promise<void> {
    if (isString(seeder)) {
        const module = (await import(toImportSpecifier(seeder))) as Record<string, unknown>;
        const seederClass = resolveSeederClass(module);
        await new seederClass().run();
    } else {
        await new seeder().run();
    }
}
