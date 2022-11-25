const Book = require('../models/book');
const Category = require('../models/category');
const Author = require('../models/author');
const Editorial = require('../models/editorial');

exports.getIndex = (req, res, next) => {
    Book.findAll({ include: [{ model: Category }, { model: Author }, { model: Editorial }] })
        .then(result => {
            const books = result.map(result => result.dataValues);
            Category.findAll()
                .then(result => {
                    const categories = result.map(result => result.dataValues);
                    res.render('home/index', {
                        title: 'Book App',
                        books,
                        hasBooks: books.length > 0,
                        categories
                    });
                }).catch(err => console.error(err));
        }).catch(err => console.error(err));
}

exports.postFilter = (req, res, next) => {
    const { all, categoriesIds } = req.body;

    if (all || !categoriesIds) {
        res.status(302).redirect('/');
        return;
    }

    Book.findAll({ include: [{ model: Category }, { model: Author }, { model: Editorial }] })
        .then(result => {
            let books = result.map(result => result.dataValues);
            Category.findAll()
                .then(result => {
                    const categories = result.map(result => result.dataValues);

                    if (typeof categoriesIds == 'string') {
                        const categoryId = categoriesIds;
                        books = books.filter(book => book.categoryId == categoryId);
                    } else if (typeof categoriesIds == 'object') {
                        const filteredBooks = [];
                        books.forEach(book => {
                            categoriesIds.forEach(id => {
                                if (id == book.categoryId)
                                    filteredBooks.push(book);
                            });
                        });
                        books = filteredBooks;
                    }

                    res.render('home/index', {
                        title: 'Book App',
                        books,
                        hasBooks: books.length > 0,
                        categories
                    });
                }).catch(err => console.error(err));
        }).catch(err => console.error(err));
}

exports.postSearchByName = (req, res, next) => {
    const { bookTitle } = req.body;

    Book.findAll()
        .then(result => {
            let books = result.map(result => result.dataValues);
            books = books.filter(book => book.title.toLowerCase().includes(bookTitle.toLowerCase()));
            Category.findAll()
                .then(result => {
                    const categories = result.map(result => result.dataValues);
                    res.render('home/index', {
                        title: 'Book App',
                        books,
                        hasBooks: books.length > 0,
                        categories
                    });
                }).catch(err => console.error(err));
        }).catch(err => console.error(err));
}

exports.getDetail = (req, res, next) => {
    const { id } = req.params;

    Book.findOne({ where: { id }, include: [{ model: Category }, { model: Author }, { model: Editorial }] })
        .then(result => {
            const book = result.dataValues;
            res.render('home/detail', {
                title: 'Detalle',
                book
            });
        }).catch(err => console.error(err));
}