const userSchema = require('../model/adminModel');
const userModel = require('../model/userModel');
const session = require('express-session');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const loadLogin = async (req,res)=>{
    res.render('admin/login',{message: req.session.loginError,success:req.session.logoutSuccess});
    if(req.session.loginError){
        req.session.loginError = null;
    }
    if(req.session.logoutSuccess){
        req.session.logoutSuccess = null;
    }
    
}
const login = async (req,res)=>{
    try {
        const {username,password} = req.body;
        console.log(req.body);
        const admin = await userSchema.findOne({username});
        req.session.loginError = 'Invalid Username !!'
        if(!admin) return res.redirect('/admin/login');
        await bcrypt.compare(password, admin.password).then((isMatch)=>{
             if(!isMatch) {
                req.session.loginError = 'Invalid Password !!'
                return res.redirect('/admin/login');
             }else{
                 req.session.admin = true;
                 req.session.success = 'Admin Login successful!!'
                 res.redirect('/admin/dashboard');
             }
        });
    } catch (error) {
        console.log(error)
    }
}
// const loadDashboard = async (req,res)=> {
//     res.render('admin/dashboard', {admin: req.session.admin});
// }
const loadDashboard = async (req, res) => {

    try {

        const admin = req.session.admin
        // console.log(admin);
        
        if(!admin) return res.redirect('/admin/login')

        const users = await userModel.find({})
        // console.log(users);
        
        res.render('admin/dashboard',{users,success: req.session.success});

        req.session.success = req.session.success ? null : req.session.success;
        // req.session.message = req.session.message ? null : req.session.message;


    } catch (error) {
        console.log(error);
    }
}
const editUser = async (req, res) => {

    try {

        const {username,password,id} = req.body
        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await userModel.findOneAndUpdate({_id:id},
            {$set:{username,password:hashedPassword}}
        )

        req.session.success = 'User Updated successfully!!'
        res.redirect('/admin/dashboard')
    
    } catch (error) {
        console.log(error);   
    }
}
const deleteUser = async (req, res) => {

    try {

        const {id}= req.params
        const user = await userModel.findOneAndDelete({_id:id})

        req.session.success = 'User Deleted successfully!!'
        res.redirect('/admin/dashboard')
        
    } catch (error) {
        console.log(error);
    }
}

const addUser = async (req,res)=>{

    try {

        const {username,password} = req.body
        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = new userModel({
            username,
            password:hashedPassword
        })

        await newUser.save()
        req.session.success = 'User Creation successfully!!'
        res.redirect('/admin/dashboard')
        
    } catch (error) {
        console.log(error);
    }
}
const searchUsers = async (req,res)=>{

    const regex = new RegExp(`^${req.body.search}`, 'i');
    const users = await userModel.find({username: regex});
    res.json(users)
}
const logout = async (req,res)=>{
    req.session.admin = null;
    req.session.logoutSuccess = "logout successfully"
    res.redirect('/admin/login');
}

module.exports = {
    loadLogin,
    login,
    loadDashboard,
    editUser,
    deleteUser,
    addUser,
    searchUsers,
    logout
}