import mongoose from "mongoose"

const studentSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    //STUD,TEAC
    position: String,
    course: String,
    //ADMN,PROD,CONS
    level: String,
    dateReg: Date,
    lastOnline: Date
},{versionKey: false});


export default mongoose.model('user', studentSchema)
