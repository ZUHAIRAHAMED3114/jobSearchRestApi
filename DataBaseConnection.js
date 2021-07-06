const mongoose = require('mongoose');

const connectingtoDatabase = () => {

    mongoose.connect(process.env.DB_MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    }).then(con => {

        console.log(`MongoDb Database Connecting with the host :${con.connection.host} successfully`);

    })

}


module.exports = connectingtoDatabase;