const UserModel = require('../models/user-model')
const UserDto = require('../dtos/user-dto')
const bcrypt = require('bcrypt')

class UserService {
    async registration(email, nickname, password, first_name, last_name, country) {
        const candidate = await UserModel.findOne({email})
        if (candidate) {
            return
        }
        const hashPassword = await bcrypt.hash(password, 4)
        const user = await UserModel.create({
            email,
            nickname,
            password: hashPassword,
            first_name,
            last_name,
            country,
        })
        const userDto = new UserDto(user)

        return {user: userDto}
    }

    async login(email, password, done) {
        const user = await UserModel.findOne({email})
        if (!user) {
            done(null, false)
            return
        }
        const isPassEquals = await bcrypt.compare(password, user.password)
        if (!isPassEquals) {
            done(null, false)
            return
        }

        UserModel.findOneAndUpdate({email}, {
            lastVisit: Date.now()
        })
        const userDto = new UserDto(user)

        done(null, user)

        return {user: userDto}
    }
}

module.exports = new UserService()