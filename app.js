const express = require('express');
const app = express();
const ErrorHandler = require('./utility/ErrorHandler');
const dotenv = require('dotenv');
const cookie_parser = require('cookie-parser');

//setting of the config file for variables
dotenv.config({ path: './config/config.env' });

// normally this retrieving variable which are not declare,
process.on('unhandledRejection', (err) => {
        console.log(`Error:${err.message}`);
        console.log(`Shutting down the Server due to unhandleed Promise Rejection`)
        server.close(() => {
            console.log('closing the server process')
            process.exit(1)
        })

    })
    //uncaughtException are the promises which are not catched by the event loop
process.on('uncaughtException', function(err) {
        console.log(err.message);
        console.log(`shutting down the process`);
        process.exit(1);
    })
    // connecting to the database
var databaseConnection = require('./DataBaseConnection');
databaseConnection();

// body parser middleware
// cookie parser middleware
app.use(express.json());
app.use(cookie_parser());


//Route Setting 
const jobsRoute = require('./Routes/Jobs');
const authRoute = require('./Routes/auth');
//Error Handler MiddleWare
const ErrorMiddleWare = require('./MIddleWares/error');

//Route Middleware
app.use('/Api', jobsRoute);
app.use('/Api', authRoute);

app.all("*", (req, res, next) => {
    next(new ErrorHandler(`${req.originalUrl} with Route Not Found`, 404))
})
app.use(ErrorMiddleWare);
//Different MiddleWare
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`server is start procesing on port ${process.env.PORT} in ${process.env.NODE_ENV} mode.`);
})

// handling all routes