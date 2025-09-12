const express = require('express');

const router = express.Router();

const usersController = require('../controllers/usersController')

router.post('/api/register',usersController.register)
router.post('/api/login',usersController.login)

router.get('/api/me',usersController.me)
router.get('/api/login',usersController.logout)

module.exports = router