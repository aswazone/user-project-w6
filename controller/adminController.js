const userSchema = require('../model/adminModel');
const userModel = require('../model/userModel');
const session = require('express-session');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const loadLogin = async (req,res)=>{
    res.render('admin/login',{message: req.session.loginError});
    if(req.session.loginError){
        req.session.loginError = null;
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
                 req.session.adminSuccess = 'Admin Login successful!!'
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
        
        res.render('admin/dashboard',{users,success: req.session.createSuccess,adminMessage: req.session.adminSuccess,success: req.session.deleteSuccess,success: req.session.editSuccess});

        req.session.createSuccess = req.session.createSuccess ? null : req.session.createSuccess;
        req.session.adminSuccess = req.session.adminSuccess ? null : req.session.adminSuccess;
        req.session.deleteSuccess = req.session.deleteSuccess ? null : req.session.deleteSuccess;
        req.session.editSuccess = req.session.editSuccess ? null : req.session.editSuccess;


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

        req.session.editSuccess = 'User Updated successfully!!'
        res.redirect('/admin/dashboard')
    
    } catch (error) {
        console.log(error);   
    }
}
const deleteUser = async (req, res) => {

    try {

        const {id}= req.params
        const user = await userModel.findOneAndDelete({_id:id})

        req.session.deleteSuccess = 'User Deleted successfully!!'
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
        req.session.createSuccess = 'User Creation successfully!!'
        res.redirect('/admin/dashboard')
        
    } catch (error) {
        console.log(error);
    }
}
module.exports = {
    loadLogin,
    login,
    loadDashboard,
    editUser,
    deleteUser,
    addUser
}