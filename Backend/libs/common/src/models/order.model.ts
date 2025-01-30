import { AllowNull, BelongsTo, BelongsToMany, Column, DataType, Default, ForeignKey, HasMany, Table } from "sequelize-typescript";
import { BaseModel } from "./base.model";
import { User } from "./user.model";
import { Food } from "./food.model";
import { FoodOrder, Restaurant } from ".";
import { StatusOfOrder } from "../constants";

@Table({
    tableName: 'order_table',
    timestamps: true,
    indexes: [
        {
            fields: ['id'],
            name: 'orderId_index'
        }
    ]
})
export class Order extends BaseModel {
    @ForeignKey(() => User)
    @Column(DataType.UUID)
    createdBy: string;

    @BelongsTo(() => User, { foreignKey: 'createdBy', as: 'creator' })
    creator: User;

    @ForeignKey(() => User)
    @Column(DataType.UUID)
    contributorId: string;

    @BelongsTo(() => User, { foreignKey: 'contributorId', as: 'contributor' })
    contributor: User;

    @Column(DataType.INTEGER)
    numberOfContributions: number;

    @BelongsToMany(() => Food, { through: () => FoodOrder, onDelete: 'CASCADE' })
    foods: Food[];


    @AllowNull
    @ForeignKey(() => Restaurant)
    @Column(DataType.UUID)
    restaurantId?: string;


    @Default(StatusOfOrder.UNPAIED)
    @Column(DataType.ENUM(...Object.values(StatusOfOrder)))
    statusOfOrder: StatusOfOrder;
}