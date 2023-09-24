//logic for api call

// import db 
const { response } = require('express');
const db = require('./db')

//import jwt token
const jwt = require('jsonwebtoken');
const { mongo } = require('mongoose');

//register logic
const register = (acno, username, password) => {
    console.log('inside the register function');

    return db.User.findOne({ acno }).then((response) => {                 //acno:acno
        console.log(response);

        if (response) {
            //if already registerd
            return {
                statusCode: 401,
                message: "User already registerd"
            }
        }
        else {
            // if acno is not present in mongodb then create new account 

            const newUser = new db.User({
                acno,
                username,
                password,
                balance: 2000,
                transaction: []
            })

            //to store new user in bd
            newUser.save()

            // send response to the client
            return {
                statusCode: 200,
                message: "user registered sucessfully"
            }

        }

    })
}


// login logic 
const login = (acno, password) => {
    console.log('inside login function');
    return db.User.findOne({ acno, password }).then((result) => {
        if (result) {   //if acno present  in db

            // generation of token
            const token = jwt.sign({
                loginAcno: acno
            }, 'superKey2023')

            return {  //response to the client
                statusCode: 200,
                message: "login sucessful",
                currentUser: result.username,
                token,
                currentAcno: acno
            }
        }
        else { //if acno not present in db
            return {
                statusCode: 401,
                message: "invalid data"
            }
        }
    })
}


//get balance logic
const getBalance = (acno) => {
    return db.User.findOne({ acno }).then((result) => {
        if (result) {
            return {
                statusCode: 200,
                balance: result.balance
            }
        }
        else {
            return {
                statusCode: 401,
                message: 'Invalid account number'
            }
        }
    })
}

//fund transfer
const fundTransfer = (fromAcno, fromAcnoPswd, toAcno, amt) => {
    // convert amt to number 
    let amount = parseInt(amt)

    // check fromAcno in mongodb 
    return db.User.findOne({ acno: fromAcno, password: fromAcnoPswd }).then((debit) => {
        if (debit) {
            // to check toAcno in db
            return db.User.findOne({ acno: toAcno }).then((credit) => {
                if (credit) {
                    if (debit.balance >= amount) {
                        debit.balance -= amount
                        //to update transactions in transaction[]
                        debit.transaction.push({
                            type: 'debit',
                            amount,
                            fromAcno,
                            toAcno
                        })
                        //save changes in db
                        debit.save()

                        //udate toAcno in db
                        credit.balance += amount
                        credit.transaction.push({
                            type: 'credit',
                            amount,
                            fromAcno,
                            toAcno
                        })

                        //save chang in db
                        credit.save()
                        // send response back to the client 
                        return {
                            statusCode: 200,
                            message: "sucessfuly completed the transaction"
                        }
                    }
                    else {
                        return {
                            statusCode: 401,
                            message: "Insufficient balance"
                        }
                    }

                }
                else {
                    return {
                        statusCode: 401,
                        message: 'Invalid credit account Number'
                    }
                }
            })
        }
        else {
            return {
                statusCode: 401,
                message: 'Invalid debit account number'
            }
        }
    })

}


//get transaction details
const getTransaction = (acno) => {
    // to check wheather acno present in db 
    return db.User.findOne({ acno }).then((result) => {
        if (result) {   //complete details of particular acno 
            return {
                statusCode: 200,
                transaction: result.transaction
            }
        }
        else {
            return {
                statusCode: 400,
                message: 'Invalid transaction number'
            }
        }
    })

}

//delete user account
const deleteUserAccount = (acno) => {
    // remone account from db 
    return db.User.deleteOne({ acno }).then((result) => {
        return{
            statusCode:200,
            message:"Your account has been deleted"
        }
    })
}


module.exports = {
    register,
    login,
    getBalance,
    fundTransfer,
    getTransaction,
    deleteUserAccount
} 