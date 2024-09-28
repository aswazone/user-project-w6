const express = require('express');
//setting router
const router = express.Router();

const userController = require('../controller/userController')

router.get('/login',(req,res)=>{
    res.render('user/login');
});

router.get('/register',(req,res)=>{
    res.render('user/register');
});

//post incoming
console.log('userroutes');

router.post('/login',userController.loadRegister);
router.post('/register',userController.registerUser);

module.exports = router;

