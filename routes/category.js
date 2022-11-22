const { Router } = require('express');
const categoryController = require('../controllers/categoryController');
const router = Router();

router.get('/categories', categoryController.getIndex);
router.get('/createCategory', categoryController.getCreateCategory);
router.post('/createCategory', categoryController.postCreateCategory);
router.get('/editCategory/:id', categoryController.getEditCategory);
router.post('/editCategory', categoryController.postEditCategory);
router.get('/deleteCategory/:id', categoryController.getDeleteCategory);
router.post('/deleteCategory', categoryController.postDeleteCategory);

module.exports = router;