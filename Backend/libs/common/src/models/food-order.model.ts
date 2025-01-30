import { Column, DataType, ForeignKey, Table } from "sequelize-typescript";
import { BaseModel } from "./base.model";
import { Food } from "./food.model";
import { Order } from "./order.model";

@Table({
    tableName: 'foodOrder_table',
    timestamps: true
})
export class FoodOrder extends BaseModel {
    @ForeignKey(() => Food)
    @Column(DataType.UUID)
    foodId: string;

    @ForeignKey(() => Order)
    @Column(DataType.UUID)
    orderId: string;

    @Column(DataType.INTEGER)
    number: number;

    @Column(DataType.INTEGER)
    price: number;
}