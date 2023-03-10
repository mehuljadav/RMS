require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

//
//
// Uncaught Exception Error
// undefined,declared but not used...
//
process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception Error... SHUTTING DOWN...');
  console.log(err.name, err.message, err.stack);
  process.exit(1);
});

//
//
// Database Connection
//
const url = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster-rms.6csqrrg.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`;

mongoose
  .connect(url, {
    useNewUrlParser: true,
  })
  .then(() => console.log('Database Connected Successfully...'))
  .then(() => {
    const PORT = process.env.PORT;
    app.listen(PORT, () => {
      console.log(`Server is running on PORT ${PORT}`);
    });
  });

//
//
// Unhandled Promise Rejection
// When we forget to catch error for promises in App
//
process.on('unhandledRejection', (err) => {
  console.log('Unhandled Rejection Error...');
  console.log(err.name, err.message);
  process.exit(1);
});
