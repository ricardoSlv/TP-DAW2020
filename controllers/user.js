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

    const duplicate = await checkDuplicate(newUser.name, newUser.email)

    if (duplicate)
        throw new Error(409)

    const userDirectory = join(__dirname, 'public/files/', newUser._id.toString())
    await fsPromises.mkdir(userDirectory)
    const oldPath = join(__dirname, pictureFile.path)
    //uploads/random => public/id/picture.extension
    const newPath = join(__dirname, 'public/files/', newUser._id.toString(), 'picture.' + pictureFile.originalname.split('.').pop())
    await fsPromises.rename(oldPath, newPath)

    return newUser.save()

}

export async function checkDuplicate(name, email) {
    const user = await User
        .findOne({ $or: [{ name }, { email }] })
        .exec()

    return !!user
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



