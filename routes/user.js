const express = require('express');

//setting router
const router = express.Router();

router.get('/login',(req,res)=>{
    res.render('user/login');
});
router.get('/register',(req,res)=>{
    res.render('user/register');
});

module.exports = router;

