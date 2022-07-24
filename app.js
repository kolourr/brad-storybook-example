const express = require('express')
const dotenv = require('dotenv') 
const morgan = require('morgan') //used in development mode only //this is for logging 
const exphbs = require('express-handlebars')
const connectDB = require('./config/db')
 
 


//load config 

dotenv.config({path: './config/config.env'})

connectDB()
 
 

const app = express()
  
//Logging - used only in development mode 
if(process.env.NODE_ENV === 'development' ){
    app.use(morgan('dev'))
}

 
// Handlebars - just using exphbs does not work. You need to use exphbs.engine
app.engine( '.hbs',  exphbs.engine({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', '.hbs')


//Routes
app.use('/', require('./routes/index') )


const PORT = process.env.PORT || 3000

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)) 