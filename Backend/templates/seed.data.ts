import * as dotenv from 'dotenv';
import { Sequelize } from 'sequelize-typescript';
import { User, Restaurant, Food, Order, FoodOrder, Notification } from '../libs/common/src/models';
import { Role } from '../libs/common/src/constants/enums'; 
import * as argon from 'argon2';

// Load environment variables
dotenv.config();

// Initialize Sequelize
const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DATA_BASE_HOST, // Use environment variables
  port: parseInt(process.env.DATA_BASE_PORT, 10),
  username: process.env.DATA_BASE_USERNAME,
  password: process.env.DATA_BASE_PASSWORD,
  database: process.env.DATA_BASE_NAME,
  models: [User, Restaurant, Food, Order, FoodOrder, Notification], // Register your models here
  logging: process.env.DATA_BASE_LOGGING === 'true' ? console.log : false,
});

async function seedData() {
  try {
    // Sync the database with force: true to drop and recreate all tables
    await sequelize.sync({ force: true });
    console.log('All tables dropped and recreated.');

    // Seed Users
    const usersToCreate = [
      // 3 Admins
      { username: 'Alaa', email: 'admin1@example.com', role: Role.ADMIN, hash: '12345678' },
      { username: 'Arwa', email: 'admin2@example.com', role: Role.ADMIN, hash: '12345678' },
      { username: 'Sumia', email: 'admin3@example.com', role: Role.ADMIN, hash: '12345678' },

      // 4 Users
      { username: 'Tareq', email: 'user1@example.com', role: Role.USER, hash: '12345678' },
      { username: 'Sammer', email: 'user2@example.com', role: Role.USER, hash: '12345678' },
      { username: 'Nour', email: 'user3@example.com', role: Role.USER, hash: '12345678' },
      { username: 'Layth', email: 'user4@example.com', role: Role.USER, hash: '12345678' },

      // 3 Ghosts
      { username: 'Mohammad', email: 'ghost1@example.com', role: Role.GHOST, hash: '12345678' },
      { username: 'Yaser', email: 'ghost2@example.com', role: Role.GHOST, hash: '12345678' },
      { username: 'Yhiah', email: 'ghost3@example.com', role: Role.GHOST, hash: '12345678' },
    ];

    const users = [];
    for (const userData of usersToCreate) {
      const user = await User.create(userData);
      users.push(user.dataValues);
    }
    console.log(`${usersToCreate.length} users have been successfully created.`);

    // Seed Restaurants
    const restaurantsToCreate = [
      {
        name: 'Al-Abbass',
        phoneNumber: '123-456-7890',
        picturePath: 'https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg?auto=compress&cs=tinysrgb&w=600',
        address: '123 Main St, City, Country',
      },
      {
        name: 'Al-Yamama',
        phoneNumber: '987-654-3210',
        picturePath: 'https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=600',
        address: '456 Elm St, City, Country',
      },
      {
        name: 'Jblina',
        phoneNumber: '555-555-5555',
        picturePath: 'https://images.pexels.com/photos/541216/pexels-photo-541216.jpeg?auto=compress&cs=tinysrgb&w=600',
        address: '789 Oak St, City, Country',
      },
    ];

    const restaurants = [];
    for (const restaurantData of restaurantsToCreate) {
      const restaurant = await Restaurant.create(restaurantData);
      restaurants.push(restaurant.dataValues);
    }
    console.log(`${restaurantsToCreate.length} restaurants have been successfully created.`);

    // Seed Foods
    const foodsToCreate = [
      {
        name: 'Burger',
        price: 10,
        picturePath: 'https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg?auto=compress&cs=tinysrgb&w=600',
        restaurantId: restaurants[0].id, // Associate with the first restaurant
      },
      {
        name: 'Pizza',
        price: 15,
        picturePath: 'https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=600',
        restaurantId: restaurants[0].id,
      },
      {
        name: 'Pasta',
        price: 12,
        picturePath: 'https://images.pexels.com/photos/2347311/pexels-photo-2347311.jpeg?auto=compress&cs=tinysrgb&w=600',
        restaurantId: restaurants[1].id, // Associate with the second restaurant
      },
      {
        name: 'Salad',
        price: 8,
        picturePath: 'https://images.pexels.com/photos/3338537/pexels-photo-3338537.jpeg?auto=compress&cs=tinysrgb&w=600',
        restaurantId: restaurants[2].id, // Associate with the third restaurant
      },
    ];

    const foods = [];
    for (const foodData of foodsToCreate) {
      const food = await Food.create(foodData);
      foods.push(food.dataValues);
    }
    console.log(`${foodsToCreate.length} foods have been successfully created.`);

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    // Close the database connection
    await sequelize.close();
  }
}

// Run the seed script
seedData();