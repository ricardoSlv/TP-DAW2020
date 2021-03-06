import mongoose from 'mongoose'
const ObjectId = mongoose.ObjectId

const postSchema = new mongoose.Schema(
  {
    title: String,
    subtitle: String,
    //REPORT, THESIS, ARTICLE, APP, SLIDES, TEST, SOLVEDPROB
    themes: [String],
    content: String,
    views: Number,
    favs: Number,
    producer: { _id: ObjectId, name: String },
    resources: [{ _id: ObjectId, title: String }],
    comments: [
      { user: { _id: ObjectId, name: String }, text: String, createdAt: Date },
    ],
    createdAt: Date,
  },
  { versionKey: false }
)

export default mongoose.model('post', postSchema, 'posts')
