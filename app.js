const express = require('express');
const mongoose = require('mongoose')
const dotenv = require('dotenv'); 
const morgan = require('morgan'); //used in development mode only //this is for logging 
const exphbs = require('express-handlebars');
const passport = require('passport');
const path = require('path'); //core Nodejs module 
const session = require('express-session')
const MongoStore = require('connect-mongo') 
const connectDB = require('./config/db');
const app = express()
 
 


//load config 
dotenv.config({path: './config/config.env'})

// Passport config
require('./config/passport')(passport) 
 
connectDB()
 
  


  
//Logging - used only in development mode 
if(process.env.NODE_ENV === 'development' ){
    app.use(morgan('dev'))
}

 
// Handlebars - just using exphbs does not work. You need to use exphbs.engine
app.engine( '.hbs',  exphbs.engine({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', '.hbs')


//Session Middlewear  - Needs to be above the Passport middlewear
app.use(
    session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: false, //dont create a serssion unless something is stored 
      store: MongoStore.create({mongoUrl: process.env.MONGO_URI})
       //This will store the session in mongoDB and prevent being booted out from 
     })
  )

//Passport Middlewear
app.use(passport.initialize())
app.use(passport.session())



//Stactic folder
app.use(express.static(path.join(__dirname, 'public')))


//Routes
app.use('/', require('./routes/index') )
app.use('/auth', require('./routes/auth') )



const PORT = process.env.PORT || 3000

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)) 