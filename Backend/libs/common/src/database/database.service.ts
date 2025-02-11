import { Injectable } from "@nestjs/common";
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class DataBaseService {
    constructor() {}

    async findOneOrThrow<T>(model: any, options: any): Promise<T> {
        const record = await model.findOne(options);
        
        if (!record) {
            throw new NotFoundException(`${model.name} not found`);
        }

        return record;
    }

    async findByPkOrThrow<T>(model: any, id: string): Promise<T> {
        const record = await model.findByPk(id);

        if (!record) {
            throw new NotFoundException(`Invalid ${model.name}'s ID`);
        }

        return record;
    }

    async destroyOrThrow<T>(model: any, options: any): Promise<void> {
        const deletedCount = await model.destroy(options);

        if (deletedCount === 0) {
            throw new NotFoundException(`Invalid ${model.name}'s ID`);
        }
    }

}