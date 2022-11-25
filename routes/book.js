const { Router } = require('express');
const bookController = require('../controllers/bookController');
const router = Router();

router.get('/books', bookController.getIndex);
router.get('/createBook', bookController.getCreateBook);
router.post('/createBook', bookController.postCreateBook);
router.get('/editBook/:id', bookController.getEditBook);
router.post('/editBook', bookController.postEditBook);
router.get('/deleteBook/:id', bookController.getDeleteBook);
router.post('/deleteBook', bookController.postDeleteBook);

module.exports = router;