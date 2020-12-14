import User from "../models/file.js";

export function list(){
    return User
        .find()
        .sort({name: 1})
        .exec()
}

export function insert(user){
    const newUser = new User(user)
    return newUser.save()
}
