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
  host: process.env.DATA_BASE_HOST_DEVELOPMENT, // Use environment variables
  port: parseInt(process.env.DATA_BASE_PORT_DEVELOPMENT, 10),
  username: process.env.DATA_BASE_USERNAME_DEVELOPMENT,
  password: process.env.DATA_BASE_PASSWORD_DEVELOPMENT,
  database: process.env.DATA_BASE_NAME_DEVELOPMENT,
  models: [User, Restaurant, Food, Order, FoodOrder, Notification], // Register your models here
  logging: process.env.DATA_BASE_LOGGING_DEVELOPMENT === 'true' ? console.log : false,
});

async function seedData() {
  try {
    // Sync the database with force: true to drop and recreate all tables
    await sequelize.sync({ force: true });
    console.log('All tables dropped and recreated.');

    // Seed Users
    const usersToCreate = [
      // 3 Admins
      { username: 'admin1', email: 'admin1@example.com', role: Role.ADMIN, hash: 'password1' },
      { username: 'admin2', email: 'admin2@example.com', role: Role.ADMIN, hash: 'password2' },
      { username: 'admin3', email: 'admin3@example.com', role: Role.ADMIN, hash: 'password3' },

      // 4 Users
      { username: 'user1', email: 'user1@example.com', role: Role.USER, hash: 'password1' },
      { username: 'user2', email: 'user2@example.com', role: Role.USER, hash: 'password2' },
      { username: 'user3', email: 'user3@example.com', role: Role.USER, hash: 'password3' },
      { username: 'user4', email: 'user4@example.com', role: Role.USER, hash: 'password4' },

      // 3 Ghosts
      { username: 'ghost1', email: 'ghost1@example.com', role: Role.GHOST, hash: 'password1' },
      { username: 'ghost2', email: 'ghost2@example.com', role: Role.GHOST, hash: 'password2' },
      { username: 'ghost3', email: 'ghost3@example.com', role: Role.GHOST, hash: 'password3' },
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
        name: 'Restaurant 1',
        phoneNumber: '123-456-7890',
        picturePath: '/images/restaurant1.jpg',
        address: '123 Main St, City, Country',
      },
      {
        name: 'Restaurant 2',
        phoneNumber: '987-654-3210',
        picturePath: '/images/restaurant2.jpg',
        address: '456 Elm St, City, Country',
      },
      {
        name: 'Restaurant 3',
        phoneNumber: '555-555-5555',
        picturePath: '/images/restaurant3.jpg',
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
        restaurantId: restaurants[0].id, // Associate with the first restaurant
      },
      {
        name: 'Pizza',
        price: 15,
        restaurantId: restaurants[0].id,
      },
      {
        name: 'Pasta',
        price: 12,
        restaurantId: restaurants[1].id, // Associate with the second restaurant
      },
      {
        name: 'Salad',
        price: 8,
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