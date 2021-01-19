import mongoose from "mongoose"

const resourceSchema = new mongoose.Schema({
    title: String,
    subtitle: String,
    //REPORT, THESIS, ARTICLE, APP, SLIDES, TEST, SOLVEDPROB
    themes: [String],
    likes: Number,
    producer: ObjectId,
    resources:[ObjectId],
    comments:[{user: ObjectId, text: String}],
    createdAt: Date,
},{versionKey: false})


export default mongoose.model('user', resourceSchema)
