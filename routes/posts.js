import { Router } from 'express'
const router = Router()

import * as User from '../controllers/user.js'
import * as Post from '../controllers/post.js'
import * as Resource from '../controllers/resource.js'

//TODO: Proteger as rotas

router.get('/', async (req, res, _next) => {
    //TODO: Optimize by querying on mongodb
    let posts = await Post.list()

    if(req.query.filterType==='title')
        posts = posts.filter(p=>(new RegExp(req.query.filter)).test(p.title))
    else if ((req.query.filterType==='producer'))
        posts = posts.filter(p=>(new RegExp(req.query.filter)).test(p.producer.name))

    if (req.query.sortType=='title')
        posts.sort((p1,p2)=>p1.title.localeCompare(p2.title))
    else if (req.query.sortType=='themes'){
        posts.sort((p1,p2)=>p1.themes.sort().join('').localeCompare(p2.themes.sort().join('')))
    } else if (req.query.sortType=='createdAt')
        posts.sort((p1,p2)=>p2.createdAt.getTime()-p1.createdAt.getTime())
    //TODO: Ver se funciona com posts novos
    else if(req.query.sortType=='producer')
        posts.sort((p1,p2)=>p1.producer.name.localeCompare(p2.producer.name))
    else if (req.query.sortType=='views')
        posts.sort((p1,p2)=>p2.views-p1.views)

    res.render('posts/posts',{user: req.user, posts: posts})
})

router.get('/upload', async (req, res, _next) => {
    const resources = await Resource.listPublic()
    res.render('posts/upload',{user: req.user, resources: resources})
})

// Post a new post 
router.post('/upload', async (req, res, _next) => {
    try {
        console.log(req.body)
        const post = await Post.insert(req.user, req.body)
        res.status(200).send(post)
    } 
    catch (e) {
        console.log(e)
        if (e.message === '401')
            res.sendStatus(401)
        else
            res.sendStatus(500)
    }
})

router.get('/:id', async (req, res, _next) => {
    try {
        const post = await Post.findById(req.params.id)
        const user = await User.findById(req.user._id)
        Post.addView(req.params.id)
        res.render('posts/post',{user, post})
    } 
    catch (e) {
        console.log(e)
        //TODO 404
        if (e.message === '401')
            res.sendStatus(401)
        else
            res.sendStatus(500)
    }
})

router.post('/:id/comment', async (req, res, _next) => {
    try {
        await Post.addComment(req.params.id, req.user, req.body)
        res.sendStatus(200)
    } 
    catch (e) {
        console.log('e', e)
        res.status(500).send()
    }
})

router.delete('/:id', async (req, res, _next) => {
    try {
        await Post.deleteById(req.params.id)
        res.sendStatus(200)
    } 
    catch (e) {
        console.log('e', e)
        res.sendStatus(500)
    }
})

export default router
