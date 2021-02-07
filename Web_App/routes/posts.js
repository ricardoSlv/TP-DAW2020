import { Router } from 'express'
const router = Router()

import * as User from '../controllers/user.js'
import * as Post from '../controllers/post.js'
import * as Resource from '../controllers/resource.js'

//TODO: Proteger as rotas

router.get('/', async (req, res, _next) => {

    const query = {}
    req.query.titleFilter && (query.title = new RegExp(req.query.titleFilter))
    req.query.prodFilter && (query["producer.name"] = new RegExp(req.query.prodFilter))

    const ordering = ["createdAt", "views", "favs"].includes(req.query.sortType) ? -1 : 1
    const sort = req.query.sortType ? { [req.query.sortType]: ordering } : {}

    let posts = await Post.filter(query, sort)
    posts = req.query.sortType == "themes" ? posts.sort((p1,p2)=>((p1.themes.sort()[0]||'Z').localeCompare(p2.themes.sort()[0]||'Z'))) : posts

    res.render('posts/posts', { user: req.user, posts })
})

router.get('/upload', async (req, res, _next) => {
    const resources = await Resource.listPublic()
    res.render('posts/upload', { user: req.user, resources })
})

router.post('/upload', async (req, res, _next) => {
    try {
        const post = await Post.insert(req.user, req.body)
        res.status(200).jsonp(post)
    }
    catch (e) {
        if (e.message === '401')
            res.sendStatus(401)
        else
            res.sendStatus(500)
    }
})


router.post('/edit/:id', async (req, res, _next) => {
    try {
        await Post.editById(req.params.id, req.body)
        res.sendStatus(200)
    }
    catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
})

router.get('/:id', async (req, res, _next) => {
    try {
        const post = await Post.findById(req.params.id)
        const user = await User.findById(req.user._id)

        if (!post)
            res.render('error', { user: req.user, error: { status: 404, stack: 'This post does not exist or may have been deleted' } })
        else {
            Post.addView(req.params.id)
            res.render('posts/post', { user, post })
        }
    }
    catch (e) {
        console.log(e)
        if (e.message === '401')
            res.sendStatus(401)
        else
            res.sendStatus(500)
    }
})

router.get('/:id/resources', async (req, res, _next) => {
    try {
        const post = await Post.findById(req.params.id)

        if (!post)
            res.sendStatus(404)
        else
            res.status(200).jsonp(post.resources)
    }
    catch (e) {
        console.log(e)
        if (e.message === '401')
            res.sendStatus(401)
        else
            res.sendStatus(500)
    }
})

router.get('/edit/:id', async (req, res, _next) => {
    try {
        const post = await Post.findById(req.params.id)
        const user = await User.findById(req.user._id)
        const resources = await Resource.listPublic()

        if (!post)
            res.render('error', { user: req.user, error: { status: 404, stack: 'This post does not exist or may have been deleted' } })
        else
            res.render('posts/edit', { user, post, resources })
    }
    catch (e) {
        console.log(e)
        if (e.message === '401')
            res.render('error', { user: req.user, error: { status: 401, stack: 'You must be logged in to acess this post' } })
        else
            res.render('error', { user: req.user, error: { status: 500, stack: 'Internal server error' } })

    }
})

router.post('/:id/comment', async (req, res, _next) => {
    try {
        await Post.addComment(req.params.id, req.user, req.body)
        res.sendStatus(200)
    }
    catch (e) {
        console.log(e)
        res.status(500).send()
    }
})

router.delete('/:id', async (req, res, _next) => {
    try {
        await Post.deleteById(req.params.id)
        res.sendStatus(200)
    }
    catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
})

router.delete('/:id/:idcomment', async (req, res, _next) => {
    try {
        await Post.deleteComment(req.params.id, req.params.idcomment)
        res.sendStatus(200)
    }
    catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
})

export default router
