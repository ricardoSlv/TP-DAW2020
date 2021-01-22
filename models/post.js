import mongoose from "mongoose"
const ObjectId = mongoose.ObjectId

const resourceSchema = new mongoose.Schema({
    title: String,
    subtitle: String,
    //REPORT, THESIS, ARTICLE, APP, SLIDES, TEST, SOLVEDPROB
    themes: [String],
    views: Number,
    likes: Number,
    producer: ObjectId,
    resources:[ObjectId],
    comments:[{user: ObjectId, text: String}],
    createdAt: Date,
},{versionKey: false})


export default mongoose.model('post', resourceSchema, 'posts')
