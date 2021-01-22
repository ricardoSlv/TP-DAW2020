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
