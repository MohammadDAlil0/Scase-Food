import { Column, DataType, ForeignKey, Length, NotEmpty, Table } from "sequelize-typescript";
import { BaseModel } from "./base.model";
import { User } from "./user.model";

@Table({
    tableName: 'notification_table',
    timestamps: true,
    indexes: [
        {
            fields: ['id'],
            name: 'notificationId_index'
        }
    ]
})
export class Notification extends BaseModel {
    @ForeignKey(() => User)
    @Column(DataType.UUID)
    userId: string;

    @NotEmpty({
        msg: 'Title must not empty'
    })
    @Length({ max: 100 })
    @Column(DataType.STRING)
    title: string;

    @NotEmpty({
        msg: 'description must not be empty'
    })
    @Column(DataType.STRING)
    description: string;
}
