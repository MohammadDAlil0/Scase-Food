import { AllowNull, Column, DataType, Length, NotEmpty, Table } from "sequelize-typescript";
import { BaseModel } from "./base.model";

@Table({
    tableName: 'restaurant_table',
    timestamps: true,
    indexes: [
        {
            fields: ['id'],
            name: 'restaurantId_index'
        }
    ]
})
export class Restaurant extends BaseModel {
    @NotEmpty({
        msg: 'Name must not be empty'
    })
    @Length({ max: 64 })
    @Column(DataType.STRING)
    name: string;

    @AllowNull(true)
    @Column(DataType.STRING)
    phoneNumber?: string;

    @AllowNull(true)
    @Column(DataType.STRING)
    picturePath?: string

    @AllowNull(true)
    @Column(DataType.STRING)
    adress?: string;
}
