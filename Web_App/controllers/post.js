import Post from "../models/post.js"

// Insert a new post
export async function insert(user, post) {
    //TODO: Mudar para producer se ainda n for
    const newPost = new Post(post)
    newPost.producer = {_id: user._id, name: user.name}
    newPost.views = 0
    newPost.favs = 0
    newPost.comments = []
    newPost.createdAt = new Date()
    return newPost.save()
}

export function list(){
    return Post.find({},{title:1, themes:1 , producer: 1, views: 1, favs: 1, createdAt: 1})
        .sort({createdAt: -1})
        .exec()
}

export function filter(query,sort){
    return Post.find(query)
        .collation({locale: "en" })
        .sort(sort)
        .exec()
}

export function listRecent(size){
    return Post.find({},{title:1, themes:1 , producer: 1, views: 1, favs: 1,createdAt: 1, favs: 1})
        .sort({createdAt: -1})
        .limit(size)
        .exec()
}

export function listPopular(size){
    return Post.find({},{title:1, themes:1 , producer: 1, views: 1, favs: 1, createdAt: 1, favs: 1})
        .sort({views: -1})
        .limit(size)
        .exec()
}

export function listFaved(size){
    return Post.find({},{title:1, themes:1 , producer: 1, views: 1, favs: 1,createdAt: 1, favs: 1})
        .sort({favs: -1})
        .limit(size)
        .exec()
}

export function findById(id) {
    return Post
        .findById(id)
        .exec()
}

export function editById(id, newData) {
    return Post
        .updateOne({_id: id},{$set: {
            title: newData.title,
            subtitle: newData.subtitle,
            content: newData.content, 
            themes: newData.themes,
            resources: newData.resources
        }}).exec()
}

export function deleteById(id) {
    return Post
        .findByIdAndDelete(id)
        .exec()
}

export function deleteComment(id,idcomment){
    return Post
        .findByIdAndUpdate(id,{$pull:{comments:{_id: idcomment}}})
        .exec()
}

export function deleteByProducer(producer) {

    return Post
        .deleteMany({"producer._id": producer})
        .exec()
}

export function filterByProducer(prodId) {

    return Post
        .find(
            { "producer._id": prodId },
            {title:1, themes:1 , producer: 1, views: 1, createdAt: 1}
        ).exec()
}

export function addComment(id,user,comment) {
    return Post
        .updateOne({_id: id},{$push: {
            comments: {
                user: {
                    _id: user._id, 
                    name: user.name
                }, 
                text: comment.text, 
                createdAt: new Date(),
            }
        }}).exec()
}

export function addView(id) {
    return Post
        .updateOne({_id: id},{$inc: { views: 1}})
        .exec()
}

export function getProducerById(id) {
    return Post
        .findOne({_id: id}, {producer:1})
        .exec()
}

export function addFav(id) {
    return Post
        .updateOne({_id: id},{$inc: {favs: 1}})
        .exec()
}

export function remFav(id) {
    return Post
        .updateOne({_id: id},{$inc: {favs: -1}})
        .exec()
}
