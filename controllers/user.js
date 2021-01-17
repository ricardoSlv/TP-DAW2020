import User from "../models/user.js";

export function list() {
    return User
        .find()
        .sort({ name: 1 })
        .exec()
}

export async function insert(user) {
    const newUser = new User(user)
    
    const duplicate = checkDuplicate(newUser.name,newUser.email)
    
    if (duplicate) 
        throw new Error(409)
    else
        return newUser.save()
}

export async function checkDuplicate(name, email) {
    const user = User
        .findOne({ $or: [{ name }, { email }] })
        .exec()

    return !!user
}

export async function checkCredentials(email, password) {
    const user = await User
        .findOne({ email, pass: password })
        .exec()
    
    if(user)
        return user
    else
        throw new Error('401')
}



