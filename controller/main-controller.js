const Validator = require("password-validator");
const validatorSchema = new Validator();
const userService = require('../services/user-service')
const User = require('../models/user-model')
const Child = require('../models/cancer-model')
const bcrypt = require("bcrypt");

validatorSchema.is().min(7).is().max(20).has().uppercase().has().lowercase().has().symbols().has().not().spaces()

class MainController {
    async main(req, res) {
        try {
            res.render('main')
        } catch (e) {
            console.log(e)
        }
    }
    async profile(req, res) {
        try {
            if (req.user == null) return res.redirect('/login')
            const user = await User.findOne({_id: req.user._id})
            let onSite = Date.now() - user.lastVisit
            onSite = Math.abs(onSite / 2000).toFixed()
            res.render('profile', {user: user, onSite: onSite})
        } catch (e) {
            console.log(e)
        }
    }
    async children(req, res) {
        try {
            const children = await Child.find()

            res.render('children', {children: children})
        } catch (e) {
            console.log(e)
        }
    }
    async admin(req, res) {
        try {
            if (req.user == null) return res.redirect('/login')
            const admin = await User.findOne({_id: req.user._id})
            if (admin.roles !== "ADMIN") return res.send('You dont have access to Admin Panel')
            const users = await User.find()
            const children = await Child.find()

            res.render('admin', {admin: admin, users: users, children: children})
        } catch (e) {
            console.log(e)
        }
    }
    async sortName(req, res) {
        try {
            if (req.user == null) return res.redirect('/login')
            const admin = await User.findOne({_id: req.user._id})
            if (admin.roles !== "ADMIN") return res.send('You dont have access to Admin Panel')
            const users = await User.find().sort({nickname: 1})
            const children = await Child.find()

            res.render('admin', {admin: admin, users: users, children: children})
        } catch (e) {
            console.log(e)
        }
    }
    async sortCountry(req, res) {
        try {
            if (req.user == null) return res.redirect('/login')
            const admin = await User.findOne({_id: req.user._id})
            if (admin.roles !== "ADMIN") return res.send('You dont have access to Admin Panel')
            const users = await User.find().sort({country: 1})
            const children = await Child.find()

            res.render('admin', {admin: admin, users: users, children: children})
        } catch (e) {
            console.log(e)
        }
    }
    async newUser(req, res) {
        try {
            const {email, nickname, password, first_name, last_name, country} = req.body
            const candidate = await User.findOne({email})
            if (candidate) {
                return res.send('Such a user already exists')
            }
            const hashPassword = await bcrypt.hash(password, 4)
            await User.create({
                email,
                nickname,
                password: hashPassword,
                first_name,
                last_name,
                country,
            })
            return res.redirect('/admin')
        } catch (e) {
            console.log(e)
        }
    }
    async newChild(req, res) {
        try {
            const {first_name, last_name, age, country, diagnosis, stage, collected, goal} = req.body
            await Child.create({
                first_name,
                last_name,
                age,
                country,
                diagnosis,
                stage,
                collected,
                goal
            })
            return res.redirect('/admin')
        } catch (e) {
            console.log(e)
        }
    }
    async editPage(req, res) {
        try {
            const admin = await User.findOne({_id: req.user._id})
            const user = await User.findOne({_id: req.params.id})
            return res.render('editUser', {admin: admin, user: user})
        } catch (e) {
            console.log(e)
        }
    }
    async editChildPage(req, res) {
        try {
            const admin = await User.findOne({_id: req.user._id})
            const child = await Child.findOne({_id: req.params.id})
            return res.render('editChild', {admin: admin, child: child})
        } catch (e) {
            console.log(e)
        }
    }
    async editChild(req, res) {
        try {
            const {first_name, last_name, age, country, diagnosis, stage, collected, goal} = req.body

            await Child.findOneAndUpdate({_id: req.params.id}, {
                first_name,
                last_name,
                country,
                age,
                diagnosis,
                stage,
                collected,
                goal
            })
            return res.redirect('/admin')
        } catch (e) {
            console.log(e)
        }
    }
    async editUser(req, res) {
        try {
            const {email, nickname, first_name, last_name, country, roles} = req.body
            await User.findOneAndUpdate({_id: req.params.id}, {
                email,
                nickname,
                first_name,
                last_name,
                country,
                roles
            })
            return res.redirect('/admin')
        } catch (e) {
            console.log(e)
        }
    }
    async deleteUser(req, res) {
        try {
            const user = await User.findOne({_id: req.params.id })
            if (user.roles === "ADMIN") return res.redirect('/admin')

            await User.findOneAndDelete({_id: req.params.id})
            return res.redirect('/admin')
        } catch (e) {
            console.log(e)
        }
    }
    async deleteChild(req, res) {
        try {
            await Child.findOneAndDelete({_id: req.params.id})
            return res.redirect('/admin')
        } catch (e) {
            console.log(e)
        }
    }
    async registration(req, res, next) {
        try {
            const {email, nickname, password, first_name, last_name, country} = req.body

            if (validatorSchema.validate(password) === false) return res.send('The password must be at least ' +
                '7 characters, contain at least 1 small letter, 1 capital letter, 1 digit, 1 special character')

            await userService.registration(email, nickname, password, first_name, last_name, country)
            return next()
        } catch (e) {
            console.log(e)
        }
    }
    async logout(req, res) {
        try {
            req.logout()
            res.redirect('/login')
        } catch (e) {
            console.log(e)
        }
    }
}

module.exports = new MainController()