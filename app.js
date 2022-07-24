const express = require('express');
const mongoose = require('mongoose')
const dotenv = require('dotenv'); 
const morgan = require('morgan'); //used in development mode only //this is for logging 
const exphbs = require('express-handlebars');
const passport = require('passport');
const path = require('path'); //core Nodejs module 
const methodOverride = require('method-override')
const session = require('express-session')
const MongoStore = require('connect-mongo') 
const connectDB = require('./config/db');
const app = express()
 
 


//load config 
dotenv.config({path: './config/config.env'})

// Passport config
require('./config/passport')(passport) 
 
connectDB()
 
  
// Body parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())


// Method override
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method
      delete req.body._method
      return method
    }
  })
)
  
//Logging - used only in development mode 
if(process.env.NODE_ENV === 'development' ){
    app.use(morgan('dev'))
}

// Handlebars Helpers
const {
  formatDate,
  stripTags,
  truncate,
  editIcon,
  select,
} = require('./helpers/hbs')

// Handlebars - just using exphbs does not work. You need to use exphbs.engine
app.engine( '.hbs',  exphbs.engine({ 
  helpers: {
    formatDate,
    stripTags,
    truncate,
    editIcon,
    select,
  },  
  defaultLayout: 'main', extname: '.hbs' }))
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


// Set global var
app.use(function (req, res, next) {
  res.locals.user = req.user || null
  next()
})


//Stactic folder
app.use(express.static(path.join(__dirname, 'public')))


//Routes
app.use('/', require('./routes/index') )
app.use('/auth', require('./routes/auth') )
app.use('/stories', require('./routes/stories') )




const PORT = process.env.PORT || 3000

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)) 