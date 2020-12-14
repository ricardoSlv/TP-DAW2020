import mongoose from "mongoose"

const studentSchema = new mongoose.Schema({
    name: String,
    date: [String],
},{versionKey: false});

export default mongoose.model('user', studentSchema)
