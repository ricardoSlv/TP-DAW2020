import Resource from "../models/resource.js"

import fs from "fs"
const fsPromises = fs.promises
import path, { join } from "path"
const __dirname = path.resolve(path.dirname(''))


export async function insert(user, resource, zipFile) {

    const newResource = new Resource(resource)
    newResource.producer = {_id: user._id, name: user.name}
    newResource.registeredAt = new Date()
    newResource.downloads = 0

    try {
        // In case user directory doesnt exist
        const userDirectory = join(__dirname, 'user_files/', user._id)
        const oldPath = join(__dirname, zipFile.path)
        if (!fs.existsSync(userDirectory))
            await fsPromises.mkdir(userDirectory)

        //uploads/random => public/userid/resourceid.extension
        const newPath = join(__dirname, 'user_files/', user._id, newResource._id + '.' + zipFile.originalname.split('.').pop())
        await fsPromises.rename(oldPath, newPath)
    } catch (e) {
        throw new Error(e)
    }

    return newResource.save()
}

export function findById(id) {
    return Resource
        .findById(id)
        .exec()
}

export function deleteById(id) {
    return Resource
        .findByIdAndDelete(id)
        .exec()
}

export function updateById(id,update) {
    return Resource
        .findByIdAndUpdate(id, update)
        .exec()
}

export function filterByProducer(prodId, visibility) {

    const filter = visibility===undefined ? { "producer._id": prodId } : 
        visibility=== true ? { "producer._id": prodId , public: true} : 
        { "producer._id": prodId , public: false}

    return Resource
        .find(
            filter,
            {title:1, producer: 1, type: 1, downloads: 1, registeredAt: 1, public: 1,  createdAt: 1}
        ).exec()
}

export function listPublic(){
    return Resource.find(
        {public: true},
        {title:1, producer: 1, type: 1, downloads: 1, registeredAt: 1, createdAt: 1}
        ).exec()
}

export function list(){
    return Resource.find(
        {},
        {title:1, producer: 1, type: 1, downloads: 1, public: 1, registeredAt: 1, createdAt: 1}
        ).exec()
}

export function addDownload(id) {
    return Resource
        .updateOne({_id: id},{$inc: { downloads: 1}})
        .exec()
}


