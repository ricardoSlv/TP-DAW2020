import mongoose from "mongoose"

const resourceSchema = new mongoose.Schema({
    title: String,
    subtitle: String,
    //REPORT, THESIS, ARTICLE, APP, SLIDES, TEST, SOLVEDPROB
    tipe: String,
    producer: ObjectId,
    createdAt: Date,
    visibility: Boolean
},{versionKey: false})


export default mongoose.model('user', resourceSchema)
