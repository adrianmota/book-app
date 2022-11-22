const { Router } = require('express');
const editorialController = require('../controllers/editorialController');
const router = Router();

router.get('/editorials', editorialController.getIndex);
router.get('/createEditorial', editorialController.getCreateEditorial);
router.post('/createEditorial', editorialController.postCreateEditorial);
router.get('/editEditorial/:id', editorialController.getEditEditorial);
router.post('/editEditorial', editorialController.postEditEditorial);
router.get('/deleteEditorial/:id', editorialController.getDeleteEditorial);
router.post('/deleteEditorial', editorialController.postDeleteEditorial);

module.exports = router;