import mongoose from "mongoose"
const ObjectId = mongoose.ObjectId

const resourceSchema = new mongoose.Schema({
    title: String,
    subtitle: String,
    //REPORT, THESIS, ARTICLE, APP, SLIDES, TEST, SOLVEDPROB
    type: String,
    producer: {_id: ObjectId, name: String},
    createdAt: Date,
    registeredAt: Date,
    downloads: Number,
    favs: Number,
    public: Boolean
},{versionKey: false})


export default mongoose.model('resource', resourceSchema, 'resources')
