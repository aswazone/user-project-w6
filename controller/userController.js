const userSchema = require('../model/userModel');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const registerUser = async (req,res)=>{

    try {

        const {username,password} = req.body;
        console.log(req.body)
        const user = await userSchema.findOne({username});
        
        //checking if user exists
        if(user) return res.render('user/register', {message: 'User already exists'})
        
        //after finding user
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        console.log(`hashedPassword : ${hashedPassword}`);
        
        //creating new user
        const newUser = new userSchema({
            username,
            password: hashedPassword
        });
        await newUser.save();
        res.render('user/login',{message: 'User created successfully'});
        
    } catch (error) {
        res.render('user/register', {message: 'Something went wrong'})
    }

} 

const login = async (req,res)=>{
    console.log('loooooooooogin')
    
    try{
        console.log('login')
        
        const {username,password} = req.body;
        const user = await userSchema.findOne({username});
        console.log(user)
        if(!user) return res.render('user/login', {message: 'User not found'})
        
        //checking password = hashedPassword
        const isMatch = await bcrypt.compare(password, user.password);
        console.log(isMatch)
        
        if(!isMatch) return res.render('user/login', {message: 'Password incorrect'})

        //setting session
        req.session.user = true
        //login successful  
        res.redirect('/user/home');

    }catch(error){
        console.log('erroor');
        
        res.render('user/login', {message: 'Something went wrong'})
    }
}
const loadRegister = async (req,res)=>{
    res.render('user/register');
}

const loadLogin = async (req,res)=>{
    res.render('user/login');
}

const loadHome  = async (req,res)=>{
    // res.render('user/userHome')
    res.render('user/home', {message: 'Login successful'})
}
const logout = async (req,res)=>{
    req.session.user = null
    res.redirect('/user/login');
}

module.exports = {
    loadRegister,
    registerUser,
    loadLogin,
    login,
    loadHome,
    logout
}
