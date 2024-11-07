const mongoose = require('mongoose');

const connectDatabase = ()=>{
    mongoose.connect(process.env.DB_LOCAL_URI,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    }).then(con=>{
        console.log(`MongoDB is connected to the host: ${con.connection.host} `)
    }).catch((error) => {
        console.log(`DB connect Error`, error)
    })
}

module.exports = connectDatabase;