const express       = require('express');
const UserCtrl      = require('../controllers/userCtrl');
const authorization = require('../middlewares/authorization');

const router = express.Router();

router.post('/signup', UserCtrl.user_signup);
router.post('/login', UserCtrl.user_login);
router.delete('/:id', authorization, UserCtrl.user_delete_user);

module.exports = router;