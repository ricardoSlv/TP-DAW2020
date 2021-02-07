import Resource from "../models/resource.js"

import fs from "fs"
const fsPromises = fs.promises
import path, { join } from "path"
const __dirname = path.resolve(path.dirname(''))

import unzipper from "unzipper"


export async function insert(user, resource, zipFile) {
    
    const newResource = new Resource(resource)
    newResource.producer = {_id: user._id, name: user.name}
    newResource.registeredAt = new Date()
    newResource.downloads = 0
    newResource.favs = 0

    const userDirectory = join(__dirname, 'user_files/', user._id)
    const resourceDirectory = join(__dirname, 'user_files/', user._id, '/'+newResource._id)
    const newPath = join(__dirname, 'user_files/', user._id, newResource._id+'', '/', newResource._id + '.' + zipFile.originalname.split('.').pop())
    const oldPath = join(__dirname, zipFile.path)
    try {
        // In case user directory doesnt exist
        if (!fs.existsSync(userDirectory))
            await fsPromises.mkdir(userDirectory)
            
        await fsPromises.mkdir(resourceDirectory)
        await fsPromises.rename(oldPath, newPath)
        
        await fs.createReadStream(newPath)
        .pipe(unzipper.Extract({ path: userDirectory+'/'+ newResource._id })).promise()

        const jsonFile = await fsPromises.readFile(userDirectory+'/'+ newResource._id +'/manifest.json')
        const manifestData = JSON.parse(jsonFile)

        for(const file of manifestData.files){
            await fsPromises.readFile(`${userDirectory}/${newResource._id}/${file.path}`)
            newResource.files.push(file)
        }

    } catch (e) {
        await fsPromises.rmdir(`${userDirectory}/${newResource._id}`,{ recursive: true })
        throw new Error(' Manifest error, couldnt not find : '+e.path.split('user_files/')[1].split('/').slice(2).join('/'))
    }

    return newResource.save()
}

export function findById(id) {
    return Resource
        .findById(id)
        .exec()
}

export function editById(id, title, subtitle, type) {
    return Resource
    .updateOne({_id: id},{$set: {
        title: title,
        subtitle: subtitle,
        type: type
    }}).exec()
}

export async function deleteById(id) {
    
    try{
        const resource = await Resource.findById(id)
        const resourceDirectory = join(__dirname, 'user_files/', resource.producer._id+'/'+resource._id)
        await fsPromises.rmdir(resourceDirectory,{ recursive: true })
    }catch(e){
        console.log(e)
    }

    return Resource
        .findByIdAndDelete(id)
        .exec()
}

export function deleteByProducer(producer) {

    return Resource
        .deleteMany({"producer._id": producer})
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
            {title:1, producer: 1, type: 1, downloads: 1, registeredAt: 1, public: 1,  createdAt: 1, favs:1}
        ).exec()
}

export function listPublic(){
    return Resource.find(
        {public: true},
        {title:1, producer: 1, type: 1, downloads: 1, registeredAt: 1, createdAt: 1, favs:1}
        ).exec()
}

export function list(){
    return Resource.find(
        {},
        {title:1, producer: 1, type: 1, downloads: 1, public: 1, registeredAt: 1, createdAt: 1, favs:1}
        ).exec()
}

export function filter(query,sort){
    return Resource.find(query)
        .collation({locale: "en" })
        .sort(sort)
        .exec()
}

export function addDownload(id) {
    return Resource
        .updateOne({_id: id},{$inc: { downloads: 1}})
        .exec()
}

export function getProducerById(id) {
    return Resource
        .findOne({_id: id}, {producer:1})
        .exec()
}

export function addFav(id) {
    return Resource
        .updateOne({_id: id},{$inc: {favs: 1}})
        .exec()
}

export function remFav(id) {
    return Resource
        .updateOne({_id: id},{$inc: {favs: -1}})
        .exec()
}


