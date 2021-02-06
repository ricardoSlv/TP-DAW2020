import { Router } from 'express'
const router = Router()

import multer from 'multer'
const upload = multer({ dest: 'uploads/' })

import * as User from '../controllers/user.js'
import * as Resource from '../controllers/resource.js'
import * as Post from '../controllers/post.js'

//TODO: Proteger as rotas, error handling
router.get('/', async (req, res, _next) => {

    let users = await User.list()

    // Filter
    if (req.query.filterType === 'name')
        users = users.filter(u => (new RegExp(req.query.filter)).test(u.name))
    else if ((req.query.filterType === 'course'))
        users = users.filter(u => (new RegExp(req.query.filter)).test(u.course))

    // Sort
    if (req.query.sortType == 'name')
        users.sort((u1, u2) => u1.name.localeCompare(u2.name))
    else if (req.query.sortType == 'position')
        users.sort((u1, u2) => u1.position.localeCompare(u2.position))
    else if (req.query.sortType == 'joinedAt')
        users.sort((u1, u2) => u2.dateReg.getTime() - u1.dateReg.getTime())
    else if (req.query.sortType == 'lastSeen')
        users.sort((u1, u2) => u2.lastOnline.getTime() - u1.lastOnline.getTime())
    else if (req.query.sortType == 'course')
        users.sort((u1, u2) => u1.course.localeCompare(u2.course))
    else if (req.query.sortType == 'level')
        users.sort((u1, u2) => u1.level.localeCompare(u2.level))
    else if (req.query.sortType == 'favourites')
        users.sort((u1, u2) => u2.favs - u1.favs)

    res.render('users/users', { user: req.user, users })
})

router.get('/profile', async (req, res, _next) => {
    const user = await User.findById(req.user?._id)

    if (user) {
        const resources = await Resource.filterByProducer(req.user._id)
        const posts = await Post.filterByProducer(req.user._id)
        res.render('users/profile', { user, posts, resources })
    }
    else
        res.redirect('/login')
})

router.get('/admin', async (req, res, _next) => {
    const user = await User.findById(req.user?._id)
    console.log(req.user, user)
    if (user && user.level.localeCompare("ADMN") == 0) {
        const resources = await Resource.list()
        const posts = await Post.list()
        const users = await User.list()
        res.render('users/admin', { user, posts, resources, users })
    }
    else
        res.redirect('/login')
})

router.get('/edit/:id', async (req, res, _next) => {
    const user = await User.findById(req.params.id)

    if (user) {
        console.log(user)
        res.render('users/edit', { user })
    }
    else {
        res.status(401)
        res.render('error', { user: req.user, error: { status: 401, stack: 'This page is only acessible to admins' } })
    }
})

router.post('/edit/:id', upload.single('picture'), async (req, res, _next) => {
    const user = await User.editById(req.params.id, req.body, req.file)
    if (user) {
        res.sendStatus(200)
    }
    else {
        res.status(401)
        res.render('error', { user: req.user, error: { status: 401, stack: 'This page is only acessible to admins' } })
    }
})

router.get('/:id', async (req, res, _next) => {
    const user = await User.findById(req.params.id)

    if (user) {
        const resources = await Resource.filterByProducer(req.params.id, true)
        const posts = await Post.filterByProducer(req.params.id)
        res.render('users/user', { user, posts, resources })
    }
    else {
        res.status(401)
        res.render('error', { user: req.user, error: { status: 401, stack: 'This page is only acessible to admins' } })
    }
})

router.get('/:id/picture', async (req, res, _next) => {
    if (req.user) {
        res.download('./user_files/' + req.params.id + '/picture')
    } else
        res.error(401, { user: req.user })
})

// Add post to favourites
router.post('/:id/favouritesPosts/', async (req, res, _next) => {
    try {
        const idUser = await Post.getProducerById(req.body._id)
        await User.addfavPost(req.params.id, req.body._id, req.body.title)
        await User.addFav(idUser.producer._id)
        await Post.addFav(req.body._id)
        res.sendStatus(201)
    }
    catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
})

// Add resource to favourites
router.post('/:id/favouritesResources/', async (req, res, _next) => {
    try {
        const idUser = await Resource.getProducerById(req.body._id)
        await User.addfavRes(req.params.id, req.body._id, req.body.title)
        await User.addFav(idUser.producer._id)
        await Resource.addFav(req.body._id)
        res.sendStatus(201)
    }
    catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
})

// Remove post from favourites
router.delete('/:id/favouritesPosts/:postid', async (req, res, _next) => {
    try {
        const idUser = await Post.getProducerById(req.params.postid)
        await User.remfavPost(req.params.id, req.params.postid)
        await User.remFav(idUser.producer._id)
        await Post.remFav(req.params.postid)
        res.sendStatus(200)
    }
    catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
})

// Remove resource from favourites
router.delete('/:id/favouritesResources/:resid', async (req, res, _next) => {
    try {
        const idUser = await Resource.getProducerById(req.params.resid)
        await User.remfavRes(req.params.id, req.params.resid)
        await User.remFav(idUser.producer._id)
        await Resource.remFav(req.params.resid)
        res.sendStatus(200)
    }
    catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
})

router.delete('/:id', async (req, res, _next) => {
    try {
        await User.deleteById(req.params.id)
        res.sendStatus(200)
    }
    catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
})

export default router
