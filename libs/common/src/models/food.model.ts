import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Length, Min, NotEmpty, Table } from "sequelize-typescript";
import { BaseModel } from "./base.model";
import { Restaurant } from "./restaurant.model";
import { FoodOrder } from "./food-order.model";
import { Order } from "./order.model";

@Table({
    tableName: 'food_table',
    timestamps: true,
    indexes: [
        {
            fields: ['id'],
            name: 'foodId_index'
        }
    ]
})
export class Food extends BaseModel {
    @NotEmpty({
        msg: 'Name must not be empty'
    })
    @Length({ max: 64 })
    @Column(DataType.STRING)
    name: string;

    @NotEmpty({
        msg: 'Price must not be empty'
    })
    @Min(0)
    @Column(DataType.INTEGER)
    price: number;

    @ForeignKey(() => Restaurant)
    @Column(DataType.UUID)
    restaurantId: string;

    @BelongsTo(() => Restaurant, { foreignKey: 'roleChangedBy', as: 'roleChangedByUser' })
    restaurant: Restaurant;

    @BelongsToMany(() => Order, { through: () => FoodOrder, onDelete: 'CASCADE' })
    orders: Order[];
}