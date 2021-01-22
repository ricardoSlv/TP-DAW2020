import Post from "../models/post.js"

// Insert a new post
export async function upload(user, post) {
    console.log(`Entrei e o body = ${JSON.stringify(post)}`)
    const newPost = new Post(post)
    newPost.themes = newPost.themes[0].split(',')
    newPost.producer = user._id
    newPost.views = 0
    newPost.likes = 0
    newPost.comments = []
    newPost.createdAt = new Date()
    return newPost.save()
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
