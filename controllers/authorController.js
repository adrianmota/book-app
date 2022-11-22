const Author = require('../models/author');

exports.getIndex = (req, res, next) => {
    Author.findAll()
        .then(result => {
            const authors = result.map(result => result.dataValues);
            res.render('author/index', {
                title: 'Autores',
                authorIsActive: true,
                authors,
                hasAuthors: authors.length > 0,
            });
        }).catch(err => console.error(err));
}

exports.getCreateAuthor = (req, res, next) => {
    res.render('author/saveAuthor', {
        title: 'Crear Autor',
        editMode: false,
        authorIsActive: true,
    });
}

exports.postCreateAuthor = (req, res, next) => {
    const { name, email } = req.body;
    const author = { name, email };
    let hasNoName = false;
    let hasNoEmail = false;

    if (!name) hasNoName = true;
    if (!email) hasNoEmail = true;

    if (hasNoName || hasNoEmail) {
        res.render('author/saveAuthor', {
            title: 'Crear Autor',
            editMode: false,
            authorIsActive: true,
            hasNoName,
            hasNoEmail,
            author
        });
        return;
    }

    Author.create({ name, email })
        .then(result => {
            console.log(result);
            res.status(302).redirect('/authors');
        }).catch(err => console.error(err));
}

exports.getEditAuthor = (req, res, next) => {
    const { id } = req.params;
    const { edit } = req.query;

    if (!edit) {
        res.status(302).redirect('/authors');
        return;
    };

    Author.findOne({ where: { id } })
        .then(result => {
            if (!result) {
                res.status(302).redirect('/authors');
                return;
            }

            const author = result.dataValues;
            res.render('author/saveAuthor', {
                title: 'Editar Autor',
                editMode: edit,
                authorIsActive: true,
                author
            })
        }).catch(err => console.error(err));
}

exports.postEditAuthor = (req, res, next) => {
    const { id, name, email } = req.body;
    const author = { id, name, email };
    let hasNoName = false;
    let hasNoEmail = false;

    if (!name) hasNoName = true;
    if (!email) hasNoEmail = true;

    if (hasNoName || hasNoEmail) {
        res.render('author/saveAuthor', {
            title: 'Editar Autor',
            editMode: true,
            authorIsActive: true,
            author,
            hasNoName,
            hasNoEmail
        });
        return;
    }

    Author.findOne({ where: { id } })
        .then(result => {
            if (!result) {
                res.status(302).redirect('/authors');
            } else {
                Author.update({ name, email }, { where: { id } })
                    .then(result => {
                        console.log(result);
                        res.status(302).redirect('/authors');
                    }).catch(err => console.error(err));
            }
        }).catch(err => console.error(err));
}

exports.getDeleteAuthor = (req, res, next) => {
    const { id } = req.params;

    Author.findOne({ where: { id } })
        .then(result => {
            if (!result) {
                res.redirect('/authors');
            } else {
                const author = result.dataValues;
                res.render('author/deleteAuthor', {
                    title: 'Borrar autor',
                    authorIsActive: true,
                    author
                });
            }
        }).catch(err => console.error(err));
}

exports.postDeleteAuthor = (req, res, next) => {
    const { id } = req.body;

    Author.destroy({ where: { id } })
        .then(result => {
            res.status(302).redirect('/authors');
        }).catch(err => console.error(err));
}