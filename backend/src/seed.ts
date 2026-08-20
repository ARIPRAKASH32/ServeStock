import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import Restaurant from './models/Restaurant';
import User from './models/User';
import Ingredient from './models/Ingredient';
import WasteRecord from './models/WasteRecord';
import Purchase from './models/Purchase';

dotenv.config();

export const seedDB = async () => {
  try {
    // Clear existing data
    await Restaurant.deleteMany({});
    await User.deleteMany({});
    await Ingredient.deleteMany({});
    await WasteRecord.deleteMany({});
    await Purchase.deleteMany({});
    console.log('Cleared existing data');

    // Create Restaurant
    const restaurant = await Restaurant.create({
      name: 'The Great Indian Kitchen',
      address: '123 Curry Lane',
      phone: '123-456-7890'
    });

    // Create Users
    const user = await User.create({
      name: 'Admin Manager',
      email: 'admin@servestock.com',
      password: 'admin123',
      role: 'ADMIN',
      restaurantId: restaurant._id
    });

    const manager = await User.create({
      name: 'Store Manager',
      email: 'manager@servestock.com',
      password: 'manager123',
      role: 'RESTAURANT_MANAGER',
      restaurantId: restaurant._id
    });

    const staff = await User.create({
      name: 'Kitchen Staff',
      email: 'staff@servestock.com',
      password: 'staff123',
      role: 'STAFF',
      restaurantId: restaurant._id
    });

    // Create Ingredients (some safe, some expiring, some expired)
    const today = new Date();
    const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
    const nextWeek = new Date(today); nextWeek.setDate(today.getDate() + 7);
    const nextMonth = new Date(today); nextMonth.setDate(today.getDate() + 30);
    const past = new Date(today); past.setDate(today.getDate() - 2);

    const ingredients = [
      { name: 'Basmati Rice', category: 'Grains', quantity: 200, unit: 'kg', minimumStockLevel: 50, purchasePrice: 2, averageDailyUsage: 5, expiryDate: nextMonth, restaurantId: restaurant._id },
      { name: 'Chicken Breast', category: 'Meat', quantity: 50, unit: 'kg', minimumStockLevel: 20, purchasePrice: 5, averageDailyUsage: 10, expiryDate: nextWeek, restaurantId: restaurant._id },
      { name: 'Fresh Milk', category: 'Dairy', quantity: 30, unit: 'L', minimumStockLevel: 10, purchasePrice: 1.5, averageDailyUsage: 5, expiryDate: tomorrow, restaurantId: restaurant._id },
      { name: 'Tomatoes', category: 'Produce', quantity: 100, unit: 'kg', minimumStockLevel: 30, purchasePrice: 1.2, averageDailyUsage: 8, expiryDate: tomorrow, restaurantId: restaurant._id }, // Heavy excess for tomorrow -> Critical
      { name: 'Paneer', category: 'Dairy', quantity: 5, unit: 'kg', minimumStockLevel: 10, purchasePrice: 8, averageDailyUsage: 2, expiryDate: nextMonth, restaurantId: restaurant._id }, // Low stock
      { name: 'Onions', category: 'Produce', quantity: 150, unit: 'kg', minimumStockLevel: 40, purchasePrice: 0.8, averageDailyUsage: 12, expiryDate: nextMonth, restaurantId: restaurant._id },
      { name: 'Cilantro', category: 'Produce', quantity: 2, unit: 'kg', minimumStockLevel: 5, purchasePrice: 4, averageDailyUsage: 0.5, expiryDate: past, restaurantId: restaurant._id }, // Expired
      { name: 'Olive Oil', category: 'Pantry', quantity: 20, unit: 'L', minimumStockLevel: 10, purchasePrice: 15, averageDailyUsage: 0.5, expiryDate: nextMonth, restaurantId: restaurant._id },
      { name: 'Salmon Filet', category: 'Seafood', quantity: 40, unit: 'kg', minimumStockLevel: 15, purchasePrice: 18, averageDailyUsage: 4, expiryDate: tomorrow, restaurantId: restaurant._id },
      { name: 'Heavy Cream', category: 'Dairy', quantity: 12, unit: 'L', minimumStockLevel: 5, purchasePrice: 3.5, averageDailyUsage: 1, expiryDate: nextWeek, restaurantId: restaurant._id },
    ];

    const insertedIngredients = await Ingredient.insertMany(ingredients);
    console.log('Inserted ingredients');

    // Create Waste Records
    // Create significant waste for Tomatoes over the last 30 days to trigger Purchase Adjustment Recommendation
    const tomatoId = insertedIngredients.find(i => i.name === 'Tomatoes')?._id;
    const milkId = insertedIngredients.find(i => i.name === 'Fresh Milk')?._id;
    const salmonId = insertedIngredients.find(i => i.name === 'Salmon Filet')?._id;

    const wasteRecords = [];
    for (let i = 0; i < 20; i++) {
      const pastDate = new Date();
      pastDate.setDate(today.getDate() - Math.floor(Math.random() * 30));
      
      wasteRecords.push({
        restaurantId: restaurant._id,
        ingredientId: tomatoId,
        quantity: Math.floor(Math.random() * 5) + 2, // 2-6 kg
        reason: 'SPOILED',
        date: pastDate,
        cost: (Math.floor(Math.random() * 5) + 2) * 1.2,
        userId: user._id
      });
      
      wasteRecords.push({
        restaurantId: restaurant._id,
        ingredientId: milkId,
        quantity: Math.floor(Math.random() * 2) + 1, // 1-2 L
        reason: 'EXPIRED',
        date: pastDate,
        cost: (Math.floor(Math.random() * 2) + 1) * 1.5,
        userId: user._id
      });

      if (i % 2 === 0) {
        wasteRecords.push({
          restaurantId: restaurant._id,
          ingredientId: salmonId,
          quantity: 1, 
          reason: 'CUSTOMER_RETURN',
          date: pastDate,
          cost: 18,
          userId: user._id
        });
      }
    }

    await WasteRecord.insertMany(wasteRecords);
    console.log('Inserted waste records');

    // Create Purchases
    const purchases = [
      { restaurantId: restaurant._id, ingredientName: 'Tomatoes', categoryId: 'Produce', quantity: 50, unit: 'kg', unitPrice: 1.2, totalPrice: 60, purchaseDate: today, expiryDate: nextWeek },
      { restaurantId: restaurant._id, ingredientName: 'Fresh Milk', categoryId: 'Dairy', quantity: 20, unit: 'L', unitPrice: 1.5, totalPrice: 30, purchaseDate: today, expiryDate: nextWeek },
      { restaurantId: restaurant._id, ingredientName: 'Salmon Filet', categoryId: 'Seafood', quantity: 15, unit: 'kg', unitPrice: 18, totalPrice: 270, purchaseDate: past, expiryDate: tomorrow },
    ];

    await Purchase.insertMany(purchases);
    console.log('Inserted purchases');

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};
