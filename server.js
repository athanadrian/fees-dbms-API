require('colors');

const app = require('./app');

const port = process.env.PORT || 8000;

const server = app.listen(port, () =>
  console.log(
    `${'Server'.yellow.bold} ${'is running in'.yellow} ${
      process.env.NODE_ENV.yellow.bold.underline
    } ${'mode and listening on port:'.yellow} ${port.yellow.bold.underline}`.yellow
  )
);

// Handle unhandled promise rejections
process.on('unhandledRejection', err => {
  console.log(`UNHANDLED REJECTION 🎇 shuting down.......`);
  console.log(`Error: ${err.name} - ${err.message}`.red);
  // Close Server & exit process
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', err => {
  console.log(`UNCAUGHT EXCEPTION 🎇 shuting down.......`);
  console.log(`Error: ${err.name} - ${err.message}`.red);
  // Close Server & exit process
  server.close(() => process.exit(1));
});
