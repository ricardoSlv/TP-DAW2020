import mongoose from "mongoose"
const ObjectId = mongoose.ObjectId

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    //STUD,TEAC
    position: String,
    course: String,
    //ADMN,PROD,CONS
    level: String,
    dateReg: Date,
    lastOnline: Date,
    favouritesResources: [{_id: ObjectId, title: String}],
    favouritesPosts: [{_id: ObjectId, title: String}]
},{versionKey: false})


export default mongoose.model('user', userSchema, 'users')
