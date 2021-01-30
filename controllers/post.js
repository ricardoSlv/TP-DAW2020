import Post from "../models/post.js"

// Insert a new post
export async function insert(user, post) {
    //TODO: Mudar para producer se ainda n for
    const newPost = new Post(post)
    newPost.producer = {_id: user._id, name: user.name}
    newPost.views = 0
    newPost.likes = 0
    newPost.comments = []
    newPost.createdAt = new Date()
    return newPost.save()
}

export function list(){
    return Post.find({},{title:1, themes:1 , producer: 1, views: 1, createdAt: 1})
        .sort({createdAt: -1})
        .exec()
}

export function listRecent(size){
    return Post.find({},{title:1, themes:1 , producer: 1, views: 1, createdAt: 1})
        .sort({createdAt: -1})
        .limit(size)
        .exec()
}

export function listPopular(size){
    return Post.find({},{title:1, themes:1 , producer: 1, views: 1, createdAt: 1})
        .sort({views: -1})
        .limit(size)
        .exec()
}

export function findById(id) {
    return Post
        .findById(id)
        .exec()
}

export function deleteById(id) {
    return Post
        .findByIdAndDelete(id)
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
        }})
}
