module.exports = class UserDto{
    id;
    email;
    nickname;

    constructor(model) {
        this.email = model.email;
        this.id = model._id;
        this.nickname = model.nickname;
    }
}