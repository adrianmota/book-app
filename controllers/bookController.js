const Book = require('../models/book');
const Category = require('../models/category');
const Author = require('../models/author');
const Editorial = require('../models/editorial');
const transporter = require('../services/mailService');
const path = require('path');
const fs = require('fs');

exports.getIndex = (req, res, next) => {
    Book.findAll({ include: [{ model: Category }, { model: Author }, { model: Editorial }] })
        .then(result => {
            const books = result.map(result => result.dataValues);
            Category.findAll()
                .then(result => {
                    const categories = result.map(result => result.dataValues);
                    res.render('book/index', {
                        title: 'Libros',
                        bookIsActive: true,
                        books,
                        hasBooks: books.length > 0,
                        categories
                    });
                }).catch(err => console.error(err));
        }).catch(err => console.error(err));
}

exports.getCreateBook = (req, res, next) => {
    Category.findAll()
        .then(result => {
            const categories = result.map(result => result.dataValues);
            const hasCategories = categories.length > 0;
            Author.findAll()
                .then(result => {
                    const authors = result.map(result => result.dataValues);
                    const hasAuthors = authors.length > 0;
                    Editorial.findAll()
                        .then(result => {
                            const editorials = result.map(result => result.dataValues);
                            const hasEditorials = editorials.length > 0;
                            let canShowForm = true;

                            if (categories.length == 0 || authors.length == 0 || editorials.length == 0)
                                canShowForm = false;

                            res.render('book/saveBook', {
                                title: 'Crear Libro',
                                editMode: false,
                                canShowForm,
                                bookIsActive: true,
                                categories,
                                authors,
                                editorials,
                                hasCategories,
                                hasAuthors,
                                hasEditorials
                            });
                        }).catch(err => console.error(err));
                }).catch(err => console.error(err));
        }).catch(err => console.error(err));
}

exports.postCreateBook = (req, res, next) => {
    const { title, year, categoryId, authorId, editorialId } = req.body;
    const book = { title, year, categoryId, authorId, editorialId };
    const imageFile = req.file;
    let hasNoTitle = false;
    let hasNoYear = false;
    let hasNoAuthor = false;
    let hasNoEditorial = false;
    let hasNoCategory = false;
    let hasNoImage = false;

    if (!title) hasNoTitle = true;
    if (!year) hasNoYear = true;
    if (!authorId) hasNoAuthor = true;
    if (!editorialId) hasNoEditorial = true;
    if (!categoryId) hasNoCategory = true;
    if (!imageFile) hasNoImage = true;

    if (hasNoTitle ||
        hasNoYear ||
        hasNoAuthor ||
        hasNoEditorial ||
        hasNoCategory ||
        hasNoImage) {
        Category.findAll()
            .then(result => {
                const categories = result.map(result => result.dataValues);
                Author.findAll()
                    .then(result => {
                        const authors = result.map(result => result.dataValues);
                        Editorial.findAll()
                            .then(result => {
                                const editorials = result.map(result => result.dataValues);
                                let canShowForm = true;

                                if (categories.length == 0 || authors.length == 0 || editorials.length == 0)
                                    canShowForm = false;

                                console.log(book.categoryId);
                                res.render('book/saveBook', {
                                    title: 'Crear Libro',
                                    editMode: false,
                                    canShowForm,
                                    bookIsActive: true,
                                    book,
                                    hasNoTitle,
                                    hasNoYear,
                                    hasNoAuthor,
                                    hasNoEditorial,
                                    hasNoCategory,
                                    hasNoImage,
                                    categories,
                                    authors,
                                    editorials,
                                });
                            }).catch(err => console.error(err));
                    }).catch(err => console.error(err));
            }).catch(err => console.error(err));
        return;
    }

    const id = authorId;
    Author.findOne({ where: { id } })
        .then(result => {
            const author = result.dataValues;
            Book.create({
                title,
                year,
                authorId,
                editorialId,
                categoryId,
                imagePath: imageFile.path
            }).then(result => {
                res.status(302).redirect('/books');
                transporter.sendMail({
                    from: 'Book App',
                    to: author.email,
                    subject: `Publicación de libro`,
                    html: `<h2>Se ha publicado un libro de su autoría</h2>
                           <p>Nombre del libro: ${title}</p>`
                });
            }).catch(err => console.error(err));
        }).catch(err => console.error(err));
}

exports.getEditBook = (req, res, next) => {
    const { id } = req.params;
    const { edit } = req.query;

    if (!edit) {
        res.status(302).redirect('/books');
        return;
    }

    Book.findOne({ where: { id } })
        .then(result => {
            if (!result) {
                res.status(302).redirect('/books');
                return;
            } else {
                const book = result.dataValues;
                Category.findAll()
                    .then(result => {
                        const categories = result.map(result => result.dataValues);
                        Author.findAll()
                            .then(result => {
                                const authors = result.map(result => result.dataValues);
                                Editorial.findAll()
                                    .then(result => {
                                        const editorials = result.map(result => result.dataValues);
                                        let canShowForm = true;

                                        if (categories.length == 0 || authors.length == 0 || editorials.length == 0)
                                            canShowForm = false;

                                        res.render('book/saveBook', {
                                            title: 'Editar Libro',
                                            editMode: edit,
                                            canShowForm,
                                            bookIsActive: true,
                                            book,
                                            categories,
                                            authors,
                                            editorials
                                        });
                                    }).catch(err => console.error(err));
                            }).catch(err => console.error(err));
                    }).catch(err => console.error(err));
            }
        }).catch(err => console.error(err));
}

exports.postEditBook = (req, res, next) => {
    const { id, title, year, categoryId, authorId, editorialId } = req.body;
    const book = { id, title, year, authorId, editorialId, categoryId };
    const imageFile = req.file;

    let hasNoTitle = false;
    let hasNoYear = false;
    let hasNoAuthor = false;
    let hasNoEditorial = false;
    let hasNoCategory = false;

    if (!title) hasNoTitle = true;
    if (!year) hasNoYear = true;
    if (!authorId) hasNoAuthor = true;
    if (!editorialId) hasNoEditorial = true;
    if (!categoryId) hasNoCategory = true;

    if (hasNoTitle ||
        hasNoYear ||
        hasNoAuthor ||
        hasNoEditorial ||
        hasNoCategory) {
        Category.findAll()
            .then(result => {
                const categories = result.map(result => result.dataValues);
                Author.findAll()
                    .then(result => {
                        const authors = result.map(result => result.dataValues);
                        Editorial.findAll()
                            .then(result => {
                                const editorials = result.map(result => result.dataValues);
                                res.render('book/saveBook', {
                                    title: 'Editar Libro',
                                    editMode: true,
                                    canShowForm: true,
                                    bookIsActive: true,
                                    book,
                                    hasNoTitle,
                                    hasNoYear,
                                    hasNoAuthor,
                                    hasNoEditorial,
                                    hasNoCategory,
                                    categories,
                                    authors,
                                    editorials
                                });
                            }).catch(err => console.error(err));
                    }).catch(err => console.error(err));
            }).catch(err => console.error(err));
        return;
    }

    if (imageFile) {
        const imagePath = imageFile.path;

        Book.update({
            title,
            year,
            imagePath,
            authorId,
            categoryId,
            editorialId
        }, { where: { id } })
            .then(result => {
                console.log(result);
                res.status(302).redirect('/books');
            }).catch(err => console.error(err));
        return;
    }

    Book.findOne({ where: { id } })
        .then(result => {
            const book = result.dataValues;
            const { imagePath } = book;

            Book.update({
                title,
                year,
                imagePath,
                authorId,
                categoryId,
                editorialId
            }, { where: { id } })
                .then(result => {
                    console.log(result);
                    res.status(302).redirect('/books');
                }).catch(err => console.error(err));
        }).catch(err => console.error(err));
}

exports.getDeleteBook = (req, res, next) => {
    const { id } = req.params;

    Book.findOne({ where: { id } })
        .then(result => {
            if (!result) {
                res.status(302).redirect('/books');
                return;
            }

            const book = result.dataValues;
            res.render('book/deleteBook', {
                title: 'Borrar Libro',
                bookIsActive: true,
                book
            });
        }).catch(err => console.error(err));
}

exports.postDeleteBook = (req, res, next) => {
    const { id } = req.body;

    Book.findOne({ where: { id } })
        .then(result => {
            const { imagePath } = result.dataValues;
            Book.destroy({ where: { id } })
                .then(result => {
                    console.log(result);
                    res.status(302).redirect('/books');
                    fs.unlink(path.join(require.main.path, imagePath), (err) => console.error(err));
                }).catch(err => console.error(err));
        }).catch(err => console.error(err));
}