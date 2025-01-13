import { DataBaseService } from '@app/common/database';
import { CreateFoodDto, UpdateFoodDto, AddFoodDto } from '@app/common/dto/foodDtos';
import { Food, FoodOrder } from '@app/common/models';
import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class FoodService {
  constructor(
    @InjectModel(Food) private readonly FoodModel: typeof Food,
    @InjectModel(FoodOrder) private readonly FoodOrderModel: typeof FoodOrder,
    @Inject() private readonly dataBaseService: DataBaseService,
  ) {}


  async create(createFoodDto: CreateFoodDto) {
    return await this.FoodModel.create<Food>({
      ...createFoodDto
    });
  }

  async findAll() {
    return await this.FoodModel.findAll({});
  }

  async findOne(id: string) {
    return await this.dataBaseService.findByPkOrThrow(this.FoodModel, id);
  }

  async update(updateFoodDto: UpdateFoodDto) {
      const restaurant: Food = await this.dataBaseService.findByPkOrThrow(this.FoodModel, updateFoodDto.id);
      Object.assign(restaurant, updateFoodDto);
      await restaurant.save();
      return restaurant;
  }

  async remove(id: string) {
    return await this.dataBaseService.destroyOrThrow(this.FoodModel, {
      where: {
        id
      }
    })
  }

  async addFoodToOrder(addFoodDto: AddFoodDto) {
    const food: Food = await this.dataBaseService.findByPkOrThrow(this.FoodModel, addFoodDto.foodId);
    return await this.FoodOrderModel.create({
      ...addFoodDto,
      price: addFoodDto.number * food.price
    })
  }

  async removeFoodFromOrder(id: string) {
    await this.dataBaseService.destroyOrThrow(this.FoodOrderModel, id);
  }

  async getFoodOfOrder(id: string) {
    const foods = await this.FoodOrderModel.findAll<FoodOrder>({
      where: {
        orderId: id,
      },
      include: [
        {
          model: Food,
          as: 'food',
        }
      ]
    });
    return foods;
  }
}
