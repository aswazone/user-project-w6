const express = require('express');
const { route } = require('./routes/user');
const app = express();

//exporting routes
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');

const PORT = 3000;

app.get('/',(req,res)=>{
    res.send('hellooooo..')
})

app.listen(PORT,()=>{
    console.log(`server is running on ${PORT}`);
})