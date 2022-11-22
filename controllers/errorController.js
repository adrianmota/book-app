exports.get404 = (req, res, next) => {
    res.render('404', {
        title: '404 Not Found'
    });
}