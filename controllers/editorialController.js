const Editorial = require('../models/editorial');
const Book = require('../models/book');

exports.getIndex = (req, res, next) => {
    Editorial.findAll({ include: [{ model: Book }] })
        .then(result => {
            const editorials = result.map(result => result.dataValues);
            res.render('editorial/index', {
                title: 'Editoriales',
                editorials,
                hasEditorials: editorials.length > 0,
                editorialIsActive: true
            });
        }).catch(err => console.error(err));
}

exports.getCreateEditorial = (req, res, next) => {
    res.render('editorial/saveEditorial', {
        title: 'Crear Editorial',
        editMode: false,
        editorialIsActive: true
    });
}

exports.postCreateEditorial = (req, res, next) => {
    const { name, phone, country } = req.body;
    const editorial = { name, phone, country };
    let hasNoName = false;
    let hasNoPhone = false;
    let hasNoCountry = false;

    if (!name) hasNoName = true;
    if (!phone) hasNoPhone = true;
    if (!country) hasNoCountry = true;

    if (hasNoName || hasNoPhone || hasNoCountry) {
        res.render('editorial/saveEditorial', {
            title: 'Crear Editorial',
            editMode: false,
            editorialIsActive: true,
            editorial,
            hasNoName,
            hasNoPhone,
            hasNoCountry
        });
        return;
    }

    Editorial.create(editorial)
        .then(result => {
            console.log(result);
            res.status(302).redirect('/editorials');
        }).catch(err => console.error(err));
}

exports.getEditEditorial = (req, res, next) => {
    const { id } = req.params;
    const { edit } = req.query;

    if (!edit) {
        res.status(302).redirect('/editorials');
        return;
    }

    Editorial.findOne({ where: { id } })
        .then(result => {
            if (!result) {
                res.status(302).redirect('/editorials');
                return;
            } else {
                const editorial = result.dataValues;
                res.render('editorial/saveEditorial', {
                    title: 'Editar Editorial',
                    editMode: edit,
                    editorialIsActive: true,
                    editorial,
                });
            }
        }).catch(err => console.error(err));
}

exports.postEditEditorial = (req, res, next) => {
    const { id, name, phone, country } = req.body;
    const editorial = { id, name, phone, country };
    let hasNoName = false;
    let hasNoPhone = false;
    let hasNoCountry = false;

    if (!name) hasNoName = true;
    if (!phone) hasNoPhone = true;
    if (!country) hasNoCountry = true;

    if (hasNoName || hasNoPhone || hasNoCountry) {
        res.render('editorial/saveEditorial', {
            title: 'Editar Editorial',
            editMode: true,
            editorialIsActive: true,
            editorial,
            hasNoName,
            hasNoPhone,
            hasNoCountry
        });
        return;
    }

    Editorial.update({ name, phone, country }, { where: { id } })
        .then(result => {
            console.log(result);
            res.status(302).redirect('/editorials');
        }).catch(err => console.error(err));
}

exports.getDeleteEditorial = (req, res, next) => {
    const { id } = req.params;

    Editorial.findOne({ where: { id } })
        .then(result => {
            if (!result) {
                res.status(302).redirect('/editorials');
                return;
            } else {
                const editorial = result.dataValues;
                res.render('editorial/deleteEditorial', {
                    title: 'Borrar Editorial',
                    editorialIsActive: true,
                    editorial
                });
            }
        }).catch(err => console.error(err));
}

exports.postDeleteEditorial = (req, res, next) => {
    const { id } = req.body;

    Editorial.destroy({ where: { id } })
        .then(result => {
            console.log(result);
            res.status(302).redirect('/editorials');
        }).catch(err => console.error(err));
}