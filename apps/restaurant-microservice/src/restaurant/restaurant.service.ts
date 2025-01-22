import { DataBaseService } from '@app/common/database';
import { CreateRestaurantDto, FindAllRestaurantsDto, UpdateRestaurantDto } from '@app/common/dto/restaurantDtos';
import { Restaurant } from '@app/common/models';
import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectModel(Restaurant) private readonly RestaurantModel: typeof Restaurant,
    @Inject() private readonly dataBaseService: DataBaseService,
  ) {}


  async create(createRestaurantDto: CreateRestaurantDto) {
    return await this.RestaurantModel.create<Restaurant>({
      ...createRestaurantDto
    });
  }

  async findAll(filter: FindAllRestaurantsDto) {
    const { page, limit, ...rest } = filter;
    return await this.RestaurantModel.findAll({
      where: {...rest},
      limit,
      offset: (page - 1) * limit
    });
  }

  async findOne(id: string) {
    return await this.dataBaseService.findByPkOrThrow(this.RestaurantModel, id);
  }

  async update(updateRestaurantDto: UpdateRestaurantDto) {
      const restaurant: Restaurant = await this.dataBaseService.findByPkOrThrow(this.RestaurantModel, updateRestaurantDto.id);
      Object.assign(restaurant, updateRestaurantDto);
      await restaurant.save();
      return restaurant;

  }

  remove(id: string) {
    return this.dataBaseService.destroyOrThrow(this.RestaurantModel, {
      where: {
        id
      }
    })
  }
}
