import { Router } from 'express'
const router = Router()
import * as User from '../controllers/user.js'

router.get('/', (_, res,) => {
    User.list()
        .then(data => {res.render('files',{files: data})})
        .catch(err => {res.render('error', { error: err })})
})


export default router;
