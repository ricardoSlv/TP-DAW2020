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

    if(req.query.filterType==='title')
        resources = resources.filter(r=>(new RegExp(req.query.filter)).test(r.title))
    else if ((req.query.filterType==='producer'))
        resources = resources.filter(r=>(new RegExp(req.query.filter)).test(r.producer.name))
    
    if (req.query.sortType=='title')
        resources.sort((r1,r2)=>r1.title.localeCompare(r2.title))
    else if (req.query.sortType=='type')
        resources.sort((r1,r2)=>r1.type.localeCompare(r2.type))
    else if (req.query.sortType=='createdAt')
        resources.sort((r1,r2)=>r2.createdAt.getTime()-r1.createdAt.getTime())
    else if (req.query.sortType=='registeredAt')
        resources.sort((r1,r2)=>r2.registeredAt.getTime()-r1.registeredAt.getTime())
    else if(req.query.sortType=='producer')
        resources.sort((r1,r2)=>r1.producer.name.localeCompare(r2.producer.name))
    else if (req.query.sortType=='downloads')
        resources.sort((r1,r2)=>r2.downloads-r1.downloads)

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
        const user = await User.findById(req.user._id)
        res.render('resources/resource',{user, resource})
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
