import { Router } from 'express'
const router = Router()

import * as User from '../controllers/user.js'

router.get('/profile', async (req, res, _next) => {
    if (req.user){
        const userFull = await User.findById(req.user._id)
        console.log(userFull)
        console.log(userFull.name)
        console.log(userFull.position)
        res.render('profile',{user:userFull})
    }else
        res.render('login')
})


export default router;
