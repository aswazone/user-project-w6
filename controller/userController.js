const userSchema = require('../model/userModel');


const registerUser = async (req,res)=>{

    try {

        const {username,password} = req.body;
        console.log(username,password)
        const user = await userSchema.findOne({username});
        if(user){
            if(user) return res.render('user/register', {message: 'User already exists'})
        }
        //creating new user
        const newUser = new userSchema({username,password});
        await newUser.save();
        res.render('user/login',{message: 'User created successfully'});
        
    } catch (error) {
        res.render('user/register', {message: 'Something went wrong'})
    }

} 

const login = async (req,res)=>{
    try{
        
        const {username,password} = req.body;
        const user = await userSchema.findOne({username});
        if(!user) return res.render('user/login', {message: 'User not found'})
        if(user.password != password) return res.render('user/login', {message: 'Password incorrect'})

    }catch(error){
        console.log(error)
    }
}
const loadRegister = async (req,res)=>{
    res.render('user/register');
}

const loadLogin = async (req,res)=>{
    res.render('user/login');
}

module.exports = {
    loadRegister,
    registerUser,
    loadLogin
}
