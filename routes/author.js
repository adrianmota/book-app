const {Router} = require('express');
const authorController = require('../controllers/authorController');
const router = Router();

router.get('/authors', authorController.getIndex);
router.get('/createAuthor', authorController.getCreateAuthor);
router.post('/createAuthor', authorController.postCreateAuthor);
router.get('/editAuthor/:id', authorController.getEditAuthor);
router.post('/editAuthor', authorController.postEditAuthor);
router.get('/deleteAuthor/:id', authorController.getDeleteAuthor);
router.post('/deleteAuthor', authorController.postDeleteAuthor);

module.exports = router;