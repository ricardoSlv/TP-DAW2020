import { Router } from 'express'
const router = Router()

import * as Resource from '../controllers/resource.js'
import * as User from '../controllers/user.js'

import multer from 'multer'
const upload = multer({ dest: 'uploads/' })

//TODO: Proteger as rotas

router.get('/', async (req, res, _next) => {
    //TODO: Optimize by querying on mongodb
    let resources = await Resource.listPublic()
    console.log(req.query)

    if (req.query.titleFilter!='')
        resources = resources.filter(r => (new RegExp(req.query.titleFilter)).test(r.title))
    else if (req.query.prodFilter!='')
        resources = resources.filter(r => (new RegExp(req.query.prodFilter)).test(r.producer.name))

    if (req.query.sortType == 'title')
        resources.sort((r1, r2) => r1.title.localeCompare(r2.title))
    else if (req.query.sortType == 'type')
        resources.sort((r1, r2) => r1.type.localeCompare(r2.type))
    else if (req.query.sortType == 'createdAt')
        resources.sort((r1, r2) => r2.createdAt.getTime() - r1.createdAt.getTime())
    else if (req.query.sortType == 'registeredAt')
        resources.sort((r1, r2) => r2.registeredAt.getTime() - r1.registeredAt.getTime())
    else if (req.query.sortType == 'producer')
        resources.sort((r1, r2) => r1.producer.name.localeCompare(r2.producer.name))
    else if (req.query.sortType == 'downloads')
        resources.sort((r1, r2) => r2.downloads - r1.downloads)
    else if (req.query.sortType == 'favourites')
        resources.sort((r1, r2) => r2.favs - r1.favs)

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
