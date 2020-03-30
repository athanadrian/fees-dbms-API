const fs = require('fs');
const dotenv = require('dotenv');
require('colors');

const connectDB = require('./config/db');

// Get env variables
dotenv.config({ path: './config/config.env' });

// Get models
const Fee = require('./models/Fee');
const User = require('./models/User');
const Property = require('./models/Property');
const Asset = require('./models/Asset');
const Percentage = require('./models/Percentage');

// Connect to DB
connectDB();

// Read JSON files
const fees = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/fees.json`, 'utf-8'));

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/users.json`, 'utf-8')
);
const properties = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/properties.json`, 'utf-8')
);
const assets = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/assets.json`, 'utf-8')
);
const percentages = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/percentages.json`, 'utf-8')
);

// Import data into DB
const importData = async () => {
  try {
    await Fee.create(fees);
    await User.create(users);
    await Property.create(properties);
    await Asset.create(assets);
    await Percentage.create(percentages);

    console.log('Data imported....'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(error);
  }
};

// Delete data from DB
const deleteData = async () => {
  try {
    await Fee.deleteMany();
    await User.deleteMany();
    await Property.deleteMany();
    await Asset.deleteMany();
    await Percentage.deleteMany();

    console.log('Data deleted....'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(error);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
