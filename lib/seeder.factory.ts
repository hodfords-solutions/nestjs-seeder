import { BaseEntity } from 'typeorm';

export class SeederFactory<Entity extends BaseEntity> {
    constructor(private factory: (options?: object) => Entity) {}

    createOne(options?: object): Entity {
        return this.factory(options);
    }

    public saveOne(options?: object): Promise<Entity> {
        return this.factory(options).save();
    }

    async saveMany(count: number, options?: object): Promise<Entity[]> {
        const data = [];
        for (let i = 0; i < count; i++) {
            data.push(this.factory(options).save());
        }

        return await Promise.all(data);
    }
}
