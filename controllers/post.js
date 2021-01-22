import Post from "../models/post.js"

// Insert a new post
export async function insert(post) {
    const user = User.checkExists(post.email)
    if (user){
        const newPost = new Post(post)
        newPost.views = 0
        newPost.likes = 0
        newPost.comments = []
        newPost.createdAt = new Date()
        return newPost.save()
    }
    else 
        throw new Error('401')
}
