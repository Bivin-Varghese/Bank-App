//database connection with node

//1.Import mongoose
const mongoose = require('mongoose')


//2.Define connection string
// mongoose.connect('mongodb://localhost:27017/BankServer')

mongoose.connect('mongodb://0.0.0.0:27017/BankServer')   //corrected error


//3.Create model and schema
// model in express is same as  mongobd collection
//collection users -> model User
const User = mongoose.model('User', {
    acno: Number,
    username: String,
    password: String,
    balance: Number,
    transaction: []
})


//4.Export model
module.exports = {
    User
}
