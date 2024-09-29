const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require('path');
const connectDB = require('./db/connectDB')
const session = require('express-session')
const nocache = require('nocache')
app.use(nocache());

const PORT = 3000;

//setting session
app.use(session({
    secret:'keyboard cat',
    resave:false,
    saveUninitialized:true
}))

//setting url stringfy
app.use(express.urlencoded({extended:true}))
app.use(express.json())

//exporting routes
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');

//setting view engine
app.set('views',path.join(__dirname,'views'));
app.set('view engine','hbs');
//static folder enabling
app.use(express.static('public'));

//connecting mongoDB
connectDB();

//calling routes
app.use('/user',userRoutes);
app.use('/admin',adminRoutes);

app.get('/',(req,res)=>{
    res.send('hellooooo..')
})

app.listen(PORT,()=>{
    console.log(`server is running on ${PORT}`);
})