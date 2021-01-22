import mongoose from "mongoose"
const ObjectId = mongoose.ObjectId

const resourceSchema = new mongoose.Schema({
    title: String,
    subtitle: String,
    //REPORT, THESIS, ARTICLE, APP, SLIDES, TEST, SOLVEDPROB
    type: String,
    producer: ObjectId,
    createdAt: Date,
    registedAt: Date,
    downloads: Number,
    public: Boolean
},{versionKey: false})


export default mongoose.model('resource', resourceSchema, 'resources')
