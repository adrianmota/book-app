const Category = require('../models/category');
const Book = require('../models/book');

exports.getIndex = (req, res, next) => {
    Category.findAll({ include: [{ model: Book }] })
        .then(result => {
            const categories = result.map(result => result.dataValues);
            res.render('category/index', {
                title: 'Categorías',
                categories,
                categoryIsActive: true,
                hasCategories: categories.length > 0
            });
        }).catch(err => console.error(err));
}

exports.getCreateCategory = (req, res, next) => {
    res.render('category/saveCategory', {
        title: 'Crear Categoría',
        editMode: false,
        categoryIsActive: true,
    });
}

exports.postCreateCategory = (req, res, next) => {
    const { name, description } = req.body;
    const category = { name, description };
    let hasNoName = false;
    let hasNoDescription = false;

    if (!name) hasNoName = true;
    if (!description) hasNoDescription = true;

    if (hasNoName || hasNoDescription) {
        res.render('category/saveCategory', {
            title: 'Crear Categoría',
            editMode: false,
            categoryIsActive: true,
            category,
            hasNoName,
            hasNoDescription
        });
        return;
    }

    Category.create(category)
        .then(result => {
            console.log(result);
            res.status(302).redirect('/categories');
        }).catch(err => console.error(err));
}

exports.getEditCategory = (req, res, next) => {
    const { id } = req.params;
    const { edit } = req.query;

    if (!edit) {
        res.status(302).redirect('/categories');
        return;
    }

    Category.findOne({ where: { id } })
        .then(result => {
            if (!result) {
                res.status(302).redirect('/categories');
                return;
            } else {
                const category = result.dataValues;
                res.render('category/saveCategory', {
                    title: 'Editar Categoría',
                    editMode: edit,
                    categoryIsActive: true,
                    category
                });
            }
        }).catch(err => console.error(err));
}

exports.postEditCategory = (req, res, next) => {
    const { id, name, description } = req.body;
    const category = { id, name, description };
    let hasNoName = false;
    let hasNoDescription = false;

    if (!name) hasNoName = true;
    if (!description) hasNoDescription = true;

    if (hasNoName || hasNoDescription) {
        res.render('category/saveCategory', {
            title: 'Editar Categoría',
            editMode: true,
            categoryIsActive: true,
            category,
            hasNoName,
            hasNoDescription
        });
        return;
    }

    Category.findOne({ where: { id } })
        .then(result => {
            if (!result) {
                res.status(302).redirect('/categories');
            } else {
                Category.update({ name, description }, { where: { id } })
                    .then(result => {
                        console.log(result);
                        res.status(302).redirect('/categories');
                    }).catch(err => console.error(err));
            }
        }).catch(err => console.error(err));
}

exports.getDeleteCategory = (req, res, next) => {
    const { id } = req.params;

    Category.findOne({ where: { id } })
        .then(result => {
            if (!result) {
                res.status(302).redirect('/categories');
            } else {
                const category = result.dataValues;
                res.render('category/deleteCategory', {
                    title: 'Borrar Categoría',
                    categoryIsActive: true,
                    category
                });
            }
        }).catch(err => console.error(err));
}

exports.postDeleteCategory = (req, res, next) => {
    const { id } = req.body;

    Category.findOne({ where: { id } })
        .then(result => {
            if (!result) {
                res.status(302).redirect('/categories');
            } else {
                Category.destroy({ where: { id } })
                    .then(result => {
                        console.log(result);
                        res.status(302).redirect('/categories');
                    });
            }
        }).catch(err => console.error(err));
}