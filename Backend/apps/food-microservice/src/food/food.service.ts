import { DataBaseService } from '@app/common/database';
import { CreateFoodDto, UpdateFoodDto, FindAllFoodDto } from '@app/common/dto/foodDtos';
import { Food, FoodOrder } from '@app/common/models';
import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class FoodService {
  constructor(
    @InjectModel(Food) private readonly FoodModel: typeof Food,
    @InjectModel(FoodOrder) private readonly FoodOrderModel: typeof FoodOrder,
    @Inject() private readonly dataBaseService: DataBaseService,
  ) { }


  async create(createFoodDto: CreateFoodDto) {
    return await this.FoodModel.create<Food>({
      ...createFoodDto
    });
  }

  async findAll(filter: FindAllFoodDto) {
    const { page, limit, ...rest } = filter;
    return await this.FoodModel.findAll({
      where: { ...rest },
      limit,
      offset: (page - 1) * limit || undefined
    });
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
    await this.dataBaseService.destroyOrThrow(this.FoodModel, {
      where: {
        id
      }
    })
  }
}
