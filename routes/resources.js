import { Router } from 'express'
const router = Router()

import * as Resource from '../controllers/resource.js'

import multer from 'multer'
const upload = multer({ dest: 'uploads/' })

//TODO: Proteger as rotas

router.get('/', async (req, res, _next) => {
    const resources = await Resource.listPublic()
    res.render('resources/resources',{user: req.user, resources})
})

router.get('/upload', (req, res, _next) => {
    res.render('resources/upload',{user: req.user})
})

router.post('/upload', upload.single('zip'), async (req, res, _next) => {
    
    try {
        const resource = await Resource.insert(req.user, req.body, req.file)
        res.status(200).send(resource)
    } catch (e) {
        console.log(e)
        if (e.message === '409')
            res.status(409).send()
        else
            res.status(500).send()
    }
})

router.get('/:id', async (req, res, _next) => {
    
    try {
        const resource = await Resource.findById(req.params.id)
        res.render('resources/resource',{user: req.user, resource})
    } catch (e) {
        console.log(e)
        if (e.message === '404')
            res.status(409).send()
        else
            res.status(500).send()
    }
})

router.delete('/:id', async (req, res, _next) => {
    try {
        await Resource.deleteById(req.params.id)
        res.sendStatus(200)
    } 
    catch (e) {
        console.log('e', e)
        res.sendStatus(500)
    }
})

router.patch('/:id', async (req, res, _next) => {
    try {
        await Resource.updateById(req.params.id, req.body)
        res.sendStatus(200)
    } 
    catch (e) {
        console.log('e', e)
        res.sendStatus(500)
    }
})

//TODO: Update quando fizermos unzip
router.get('/:id/download', async (req, res, _next) => {
    if (req.user){
        const resource = await Resource.findById(req.params.id)
        Resource.addDownload(req.params.id)
        res.download(`./user_files/${resource.producer._id.toString()}/${resource.id}.zip`)
    }else
        res.error(401,{user: req.user})
})

export default router
