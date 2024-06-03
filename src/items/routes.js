const {Router} = require('express');
const controller = require('./controller');
const authenticateToken = require('../../middleware/authenticationToken');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });
const router = Router();


router.post('/upload', upload.single('image'), (req, res) => {
    res.json({ imageUrl: `/uploads/${req.file.filename}` });
});
  

// router.get("/check",authenticateToken,controller.check);
router.get("/user",authenticateToken,controller.userItems);
router.get("/",controller.getItems);
router.get("/:id",controller.getUniqueItems);
router.post("/",authenticateToken,controller.uploadItem);
router.put("/:id",authenticateToken,controller.updateItem);
router.delete("/:id",authenticateToken,controller.deleteItem);
router.get("/:itemId/bids",controller.getBids);
router.post("/:itemId/bids",authenticateToken,controller.makeBid);

module.exports = router;