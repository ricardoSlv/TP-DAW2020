import User from "../models/user.js"

import fs from "fs"
const fsPromises = fs.promises
import path, { join } from "path"
const __dirname = path.resolve(path.dirname(''))

export function list() {
    return User.find({},{
            name: 1,
            position: 1,
            course: 1,
            level: 1,
            dateReg: 1,
            lastOnline: 1
        }).exec()
}

export async function insert(user, pictureFile) {
    const newUser = new User(user)
    newUser.dateReg = new Date()
    newUser.lastOnline = new Date()
    newUser.favouritesPosts = []
    newUser.favouritesResources = []
    newUser.level = "CONS"
    newUser.favs = 0

    const duplicate = await checkDuplicate(newUser.name, newUser.email)

    if (duplicate)
        throw new Error(409)

    // In case user_files doesnt exist
    const userFiles = join(__dirname, 'user_files/')
    if (!fs.existsSync(userFiles))
        await fsPromises.mkdir(userFiles)

    const userDirectory = join(__dirname, 'user_files/', newUser._id.toString())
    await fsPromises.mkdir(userDirectory)
    const oldPath = join(__dirname, pictureFile.path)
    //uploads/random => public/id/picture
    //Without extension, let browser figure it out
    const newPath = join(__dirname, 'user_files/', newUser._id.toString(), 'picture')
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
        .updateOne(filter, query)
        .exec()
}

export function editById(id, password, position, course) {
    return User
        .updateOne({_id: id},{$set: {
            password: password,
            position: position,
            course: course
        }})
        .exec()
}

export function findById(id) {
    return User
        .findById(id)
        .exec()
}

export function deleteById(id) {
    return User
        .findByIdAndDelete(id)
        .exec()
}

export function addfavPost(id,postId,title) {
    return User
        .updateOne({_id: id},{$push: {
            favouritePosts: {
                _id: postId, 
                title: title,
            }
        }}).exec()
}

export function remfavPost(id,postId) {
    return User
        .updateOne({_id: id},{$pull: {
            favouritePosts: {
                _id: postId
            }
        }}).exec()
}

export function addfavRes(id,resId,title) {
    return User
        .updateOne({_id: id},{$push: {
            favouriteResources: {
                _id: resId, 
                title: title,
            }
        }}).exec()
}

export function remfavRes(id,resId) {
    return User
        .updateOne({_id: id},{$pull: {
            favouriteResources: {
                _id: resId
            }
        }}).exec()
}

export function addFav(id) {
    return User
        .updateOne({_id: id},{$inc: {favs: 1}})
        .exec()
}

export function listFaved(size){
    return User.find({favs: {$gt:0}},{name:1, course:1 , position: 1, favs: 1})
        .sort({favs: -1})
        .limit(size)
        .exec()
}
