const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
const cors = require('cors');

const app = express();

app.use(cors());

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    //Get JWT token from header
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(403).json({message: "Token is missing. Unauthorized"})
    }
    const token = authHeader.split(" ")[1] || authHeader;
    jwt.verify(token, "access", (err,decoded)=>{
        if(err){
            return res.status(403).json({message: "Failed to authenticate token"})
        }
        req.username = decoded.username;
        next();
    })
});
 
const PORT =5001;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
