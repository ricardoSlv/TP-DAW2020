import User from "../models/user.js";

import fs from "fs"
const fsPromises = fs.promises;
import path, { join } from "path"
const __dirname = path.resolve(path.dirname(''));

export function list() {
    return User
        .find()
        .sort({ name: 1 })
        .exec()
}

export async function insert(user, pictureFile) {
    const newUser = new User(user)
    newUser.dateReg = new Date()
    newUser.lastOnline = new Date()
    newUser.favouritesPosts = []
    newUser.favouritesResources = []

    const duplicate = await checkDuplicate(newUser.name, newUser.email)

    if (duplicate)
        throw new Error(409)
    
    // In case user_files doesnt exist
    const userFiles = join(__dirname, 'user_files/') 
    if (!fs.existsSync(userFiles)) {
        await fsPromises.mkdir(userFiles)
    }
    
    const userDirectory = join(__dirname, 'user_files/', newUser._id.toString())
    await fsPromises.mkdir(userDirectory)
    const oldPath = join(__dirname, pictureFile.path)
    //uploads/random => public/id/picture.extension
    const newPath = join(__dirname, 'user_files/', newUser._id.toString(), 'picture.' + pictureFile.originalname.split('.').pop())
    await fsPromises.rename(oldPath, newPath)

    return newUser.save()

}

export async function checkDuplicate(name, email) {
    const user = await User
        .findOne({ $or: [{ name }, { email }] })
        .exec()

    return !!user
}

export async function checkExists(email) {
    const user = await User
        .findOne({ email })
        .exec()

    if (user)
        return user
    else
        throw new Error('401')
}

export async function checkCredentials(email, password) {
    const user = await User
        .findOne({ email, password })
        .exec()

    if (user)
        return user
    else
        throw new Error('401')
}

export function update(filter, query) {
    return User
        .update(filter,query)
        .exec()
}