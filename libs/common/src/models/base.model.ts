import {
    Column,
    DataType,
    CreatedAt,
    UpdatedAt,
    Model,
    Default,
    PrimaryKey,
} from 'sequelize-typescript';
import { CreationOptional } from '@sequelize/core';

export class BaseModel extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    id: string;

    @CreatedAt
    @Column({
        field: 'createdAt',
        type: DataType.DATE,
        defaultValue: DataType.NOW
    })
    createdAt: CreationOptional<Date> | null;

    @UpdatedAt
    @Column({
        field: 'updatedAt',
        type: DataType.DATE,
        defaultValue: DataType.NOW
    })
    updatedAt: CreationOptional<Date> | null;
}
