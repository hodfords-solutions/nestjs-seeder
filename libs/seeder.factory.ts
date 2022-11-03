import { BaseEntity } from 'typeorm';

export class SeederFactory<Entity extends BaseEntity> {
    constructor(private factory: (options?: any) => Entity) {}

    createOne(options?: any): Entity {
        return this.factory(options);
    }

    public saveOne(options?: any): Promise<Entity> {
        return this.factory(options).save();
    }

    async saveMany(count: number, options?: any): Promise<Entity[]> {
        let data = [];
        for (let i = 0; i < count; i++) {
            data.push(this.factory(options).save());
        }

        return await Promise.all(data);
    }
}
