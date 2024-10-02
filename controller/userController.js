const userSchema = require('../model/userModel');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const registerUser = async (req,res)=>{

    try {

        const {username,password} = req.body;
        console.log(req.body)
        const user = await userSchema.findOne({username});
        
        req.session.registerError = 'User already exists !!'
        //checking if user exists
        if(user) return res.redirect('/user/register')
        
        //after finding user
        await bcrypt.hash(password, saltRounds).then(async(hashedPassword)=>{
            //creating new user
            const newUser = new userSchema({
                username,
                password: hashedPassword
            });
            await newUser.save();
        })
        req.session.user = {username: req.body.username}
        res.redirect('/user/home');
        
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
        if(!user){
            req.session.loginError = 'Invalid Username !!'
            return res.redirect('user/login')
        }
        //checking password = hashedPassword
        await bcrypt.compare(password, user.password).then((isMatch)=>{
            if(!isMatch){
                req.session.loginError = 'Invalid Password !!'
                console.log(req.session, " invalid");
                
                return res.redirect('/user/login')
            }else{
                //setting session
                
                req.session.user = user;
                console.log(req.session);
                //login successful  
                res.redirect('/user/home');
            }
        })



    }catch(error){
        console.log('erroor');
        req.session.loginError = 'Something went wrong !!'
        res.render('user/login', {message: req.session.registerError})
    }
}
const loadRegister = async (req,res)=>{
    res.render('user/register',{message: req.session.loginError});
    if(req.session.registerError){
        req.session.registerError = null
    }
}

const loadLogin = async (req,res)=>{
    console.log(req.session)
    res.render('user/login',{message: req.session.loginError,success: req.session.logoutSuccess});
    if(req.session.loginError || req.session.logoutSuccess){
        req.session.loginError = null
        req.session.logoutSuccess = null
    }
}

const loadHome  = async (req,res)=>{
    // res.render('user/userHome')
    res.render('user/home',{user: req.session.user});
}
const logout = async (req,res)=>{
    req.session.user = null
    req.session.logoutSuccess = "logout successfully"
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
