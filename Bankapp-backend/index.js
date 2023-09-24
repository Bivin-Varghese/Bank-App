//Backend for bankapp
//code to create server using express


//1.import express
const express = require('express');

//4. import cors
const cors = require('cors')



//import logic
const logic = require('./services/logic')

//import jwt token
const jwt = require('jsonwebtoken')

//2.create server using express
const server = express();

//5.use cors in server app (integrates frontend and backend)
server.use(cors({
    origin: 'http://localhost:4200'
}))

//6.parse json data to js in server app
server.use(express.json())

//3.setup port for server
server.listen(5000, () => {
    console.log('server listening on port:5000');
})

//7. resolving client requests
//api call
// server.get('/',(req,res)=>{
//     res.send('client get request')
// })

//application specific middleware
// const appMiddleware = (req, res, next) => {
//     console.log('Application specific middleware');
//     next()
// }

// server.use(appMiddleware)



//router specific Middleware
const routerMiddleware = (req, res, next) => {
    console.log('Router specific midleware');

    try {
        const token = req.headers['verify-token']
        const data = jwt.verify(token, 'superKey2023')
        console.log(data);//to get login acno
        req.currentAcno = data.loginAcno
        next()
    }
    catch {
        res.status(404).json({ message: 'please login first' })
    }

}




//bank app requests
// register api call
server.post('/register', (req, res) => {
    console.log('inside the register');
    console.log(req.body);
    logic.register(req.body.acno, req.body.username, req.body.password).then((result) => {

        // res.send('register request recieved')
        res.status(result.statusCode).json(result) //sends to the client
    })
})



//login

server.post('/login', (req, res) => {
    console.log('inside the login api');
    console.log(req.body);
    logic.login(req.body.acno, req.body.password).then((result) => {
        res.status(result.statusCode).json(result);  //send to the client
    })
})





//balance enquire

server.get('/balance/:acno', routerMiddleware, (req, res) => {
    console.log('inside the balnce api');
    console.log(req.params);
    logic.getBalance(req.params.acno).then((result) => {
        res.status(result.statusCode).json(result)
    })
})


//fund transfer
server.post('/fundtransfer', routerMiddleware, (req, res) => {
    console.log('inside the fund transfer api');
    console.log(req.body);
    logic.fundTransfer(req.currentAcno, req.body.password, req.body.toAcno, req.body.amount).then((result) => {

        res.status(result.statusCode).json(result)
    })
})

//get transaction details
server.get('/transactions', routerMiddleware, (req, res) => {

    console.log('inside transactions api');

    logic.getTransaction(req.currentAcno).then((result) => {

        res.status(result.statusCode).json(result)
    })
})


//delete user
server.delete('/deleteAccount', routerMiddleware, (req, res) => {
    console.log('inside the delete api call');
    logic.deleteUserAccount(req.currentAcno).then((result) => {
        res.status(result.statusCode).json(result)
    })
})

