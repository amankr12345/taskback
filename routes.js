const router=require('express').Router()
const CONTROLLER=require('./Controller')
const verify=require('./authroute')

router.post('/signup',CONTROLLER.SignUp)
router.post('/login',CONTROLLER.login)

router.post('/add',CONTROLLER.add)
router.get('/get',CONTROLLER.showUser)
module.exports=router