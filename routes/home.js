const { Router } = require('express');
const homeController = require('../controllers/homeController');
const router = Router();

router.get('/', homeController.getIndex);
router.post('/filter', homeController.postFilter);
router.post('/searchByName', homeController.postSearchByName);
router.get('/detail/:id', homeController.getDetail);

module.exports = router;