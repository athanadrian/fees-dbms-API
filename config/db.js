const mongoose = require('mongoose');

const connectOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
};

const connectDB = async () => {
  try {
    // connect to mongo atlas db
    const conn = await mongoose.connect(process.env.MONGO_URI, connectOptions);
    // connent to local mongodb
    // const conn = await mongoose.connect(process.env.DATABASE, connectOptions);
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
    return true;
  } catch (error) {
    console.log(
      `Error occured while connecting to database, ${error}`.red.underline.bold
    );
    return false;
  }
};

module.exports = connectDB;
