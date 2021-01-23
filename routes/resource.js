import { Router } from 'express'
const router = Router()

import * as Resource from '../controllers/resource.js'

import multer from 'multer'
const upload = multer({ dest: 'uploads/' })

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

export default router;
