const Router = require('express').Router
const router = new Router()
const controller = require('../controller/main-controller')
const paymentController = require('../controller/payment-controller')
const User = require('../models/user-model')
const passport = require("passport")

router.get('/', controller.main)

router.get('/profile', controller.profile)

router.get('/contact', async (req, res) => {
    res.render('contact')
})

router.get('/children', controller.children)

router.get('/admin', controller.admin)

router.get('/admin/sortByName', controller.sortName)

router.get('/admin/sortByCountry', controller.sortCountry)

router.post('/donate_paypal/:id', paymentController.donatePaypal)

router.get('/donate_success/:amount/:id', paymentController.donateSuccess)


router.get('/admin/new', async (req, res) => {
    const admin = await User.findOne({_id: req.user._id})
    res.render('newUser', {admin: admin})
})

router.get('/admin/newChild', async (req, res) => {
    const admin = await User.findOne({_id: req.user._id})
    res.render('newChild', {admin: admin})
})

router.post('/admin/new', controller.newUser)

router.post('/admin/newChild', controller.newChild)

router.get('/admin/edit/:id', controller.editPage)

router.get('/admin/editChild/:id', controller.editChildPage)

router.post('/admin/edit/:id', controller.editUser)

router.post('/admin/editChild/:id', controller.editChild)

router.get('/admin/delete/:id', controller.deleteUser)

router.get('/admin/deleteChild/:id', controller.deleteChild)

router.get('/registration', async (req, res) => {
    res.render('registration')
})

router.get('/login', async (req, res) => {
    res.render('login')
})

router.get('/logout', controller.logout)

router.post('/registration',
    controller.registration,
    passport.authenticate('local', {
        successRedirect: "/profile",
        failureRedirect: "/registration"
    }));

router.post('/login',
    passport.authenticate('local', {
        successRedirect: "/profile",
        failureRedirect: "/login"
    }));


module.exports = router