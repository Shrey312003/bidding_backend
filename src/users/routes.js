const {Router} = require('express');
const controller = require('./controller');
const authenticateToken = require('../../middleware/authenticationToken');

const router = Router();

router.post("/register",controller.addUsers);
router.post("/login",controller.loginUser);
router.get("/profile",authenticateToken,controller.getUser);

module.exports = router;