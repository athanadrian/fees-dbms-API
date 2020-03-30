const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/errorResponse');
const appErrorHandler = require('./controllers/error');
const connectDB = require('./config/db');

// get enviroment variables
dotenv.config({ path: './config/config.env' });

// import routes
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const feeRoutes = require('./routes/fees');
const feeItemRoutes = require('./routes/feeItems');
const assetRoutes = require('./routes/assets');
const propertyRoutes = require('./routes/properties');
const percentageRoutes = require('./routes/percentages');

// app
const app = express();

//*** MIDDLEWARES ***//
// Set security HTTP headers
app.use(helmet());

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});

app.use('/api', limiter);

// Body parser
app.use(express.json({ limit: '10kb' }));

// Static Files
app.use(express.static(`${__dirname}/public`));

// Cookie Parser
app.use(cookieParser());

// Data sanitization against NoSQL query
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// CORS
const corsOptions = {
  origin: '*',
  exposedHeaders: ['Content-Range']
};
app.use(cors(corsOptions));

// db connection
connectDB();

// routes middleware
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/fees', feeRoutes);
app.use('/api/v1/fee-items', feeItemRoutes);
app.use('/api/v1/assets', assetRoutes);
app.use('/api/v1/properties', propertyRoutes);
app.use('/api/v1/percentages', percentageRoutes);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server atana`, 404));
});

app.use(appErrorHandler);

module.exports = app;
