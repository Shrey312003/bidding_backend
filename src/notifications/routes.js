const {Router} = require('express');
const controller = require('./controller');
const authenticateToken = require('../../middleware/authenticationToken');

const router = Router();

router.get('/',authenticateToken,controller.getNotif);
router.post('/mark-read',authenticateToken,controller.markRead);

// router.post("/register",controller.addUsers);
// router.post("/login",controller.loginUser);
// router.get("/profile",authenticateToken,controller.getUser);

module.exports = router;