const express = require('express');
const hbs = require('hbs');
const path = require('path');
const connectDB = require('./db/connectDB')

const app = express();
const PORT = 3000;

//exporting routes
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');

//calling routes
app.use('/user',userRoutes);
app.use('/admin',adminRoutes);

//connecting mongoDB
connectDB();

app.get('/',(req,res)=>{
    res.send('hellooooo..')
})

//setting view engine
app.set('views',path.join(__dirname,'views'));
app.set('view engine','hbs');
//static folder enabling
app.use(express.static('public'));

app.listen(PORT,()=>{
    console.log(`server is running on ${PORT}`);
})