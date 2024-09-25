const express = require('express');

//setting router
const router = express.Router();

router.get('/admin',(req,res)=>{
    res.send('im admin');
});

module.exports = router;