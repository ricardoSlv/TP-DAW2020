import { Router } from 'express'
const router = Router()

import * as User from '../controllers/user.js'

router.get('/profile', async (req, res, _next) => {
    const userFull = await User.findById(req.user?._id)

    if (userFull)
        res.render('users/profile',{user:userFull})
    else
        res.redirect('/login')
})

router.get('/:id/picture', async (req, res, _next) => {
    if (req.user){
        res.download('./user_files/'+req.params.id+'/picture')
    }else
        res.error(401,{user: req.user})
})

export default router
