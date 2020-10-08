const express = require('express')
const router = express.Router()
const userControlller = require('../controller/userContoroller')

router.get('/', userControlller.viewuser)
router.get('/:id', userControlller.selectuserid)
router.post('/register', userControlller.register)
router.post('/login', userControlller.login)
router.get("/register/:token", userControlller.verification)
router.put("/updateUser/:id", userControlller.updateUser)
router.post('/addfriend/:id', userControlller.addfriend)
router.post("/email/getemail", userControlller.getEmailById);
router.get("/data/displayfriend/:id_friend", userControlller.displayFriend);
module.exports = router