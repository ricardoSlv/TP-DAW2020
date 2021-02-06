import { Router } from 'express'
const router = Router()

import * as Resource from '../controllers/resource.js'
import * as User from '../controllers/user.js'

import multer from 'multer'
const upload = multer({ dest: 'uploads/' })

//TODO: Proteger as rotas

router.get('/', async (req, res, _next) => {

    const query = {}
    req.query.titleFilter && (query.title = new RegExp(req.query.titleFilter))
    req.query.prodFilter && (query["producer.name"] = new RegExp(req.query.prodFilter))
    
    const ordering = ["createdAt","registeredAt","downloads","favs"].includes(req.query.sortType) ? -1 : 1
    const sort = req.query.sortType ? {[req.query.sortType]: ordering} : {}

    let resources = await Resource.filter(query,sort)

    res.render('resources/resources', { user: req.user, resources })
})

router.get('/upload', (req, res, _next) => {
    res.render('resources/upload', { user: req.user })
})

router.post('/upload', upload.single('zip'), async (req, res, _next) => {
    try {
        const resource = await Resource.insert(req.user, req.body, req.file)
        
        if(req.user==='CONS')
            User.update({ _id: req.user._id }, { level: "PROD" })

        res.status(200).jsonp(resource)
    } catch (e) {
        console.log(e)
        if (e.message === '409')
            res.sendStatus(409)
        else
            res.sendStatus(500)
    }
})

// Edit some post
router.post('/edit/:id', async (req, res, _next) => {
    try {
        await Resource.editById(req.params.id, req.body.title, req.body.subtitle, req.body.type)
        res.sendStatus(200)
    }
    catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
})

router.get('/:id', async (req, res, _next) => {

    try {
        const resource = await Resource.findById(req.params.id)
        const user = await User.findById(req.user._id)

        if (!resource)
            res.render('error', { user: req.user, error: { status: 404, stack: 'This resource does not exist or may have been deleted' } })
        else if (resource.public === false && resource.producer._id.toString() != user._id.toString()) {
            res.status(401)
            res.render('error', { user: req.user, error: { status: 401, stack: 'This resource has been set to private' } })
        } else
            res.render('resources/resource', { user, resource })
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
})

router.get('/:id/files/*', async (req, res, _next) => {
    const resource = await Resource.findById(req.params.id)
    const filepath = req.url.split('/').slice(3).join('/')

    if (req.user) {
        res.download(`./user_files/${resource.producer._id}/${resource._id}/${filepath}`)
    } else
        res.error(401, { user: req.user })
})

router.get('/edit/:id', async (req, res, _next) => {
    try {
        const resource = await Resource.findById(req.params.id)
        const user = await User.findById(req.user._id)
        res.render('resources/edit', { user, resource })
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

router.delete('/:id', async (req, res, _next) => {
    try {
        await Resource.deleteById(req.params.id)
        res.sendStatus(200)
    }
    catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
})

router.patch('/:id', async (req, res, _next) => {
    try {
        await Resource.updateById(req.params.id, req.body)
        res.sendStatus(200)
    }
    catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
})

router.get('/:id/download', async (req, res, _next) => {
    if (req.user) {
        const resource = await Resource.findById(req.params.id)
        Resource.addDownload(req.params.id)
        res.download(`./user_files/${resource.producer._id.toString()}/${resource._id}/${resource._id}.zip`)
    } else {
        res.status(401)
        res.render('error', { user: req.user, error: { status: 401, stack: 'You must be logged in to download any resource' } })
    }
})

export default router
