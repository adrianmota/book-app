const express = require('express');
const expressHbs = require('express-handlebars');
const path = require('path');
const sequelize = require('./context/appContext');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const homeRouter = require('./routes/home');
const bookRouter = require('./routes/book');
const authorRouter = require('./routes/author');
const categoryRouter = require('./routes/category');
const editorialRouter = require('./routes/editorial');
const errorController = require('./controllers/errorController');
const compareHelper = require('./util/helpers/hbs/compare');
const Book = require('./models/book');
const Category = require('./models/category');
const Editorial = require('./models/editorial');
const Author = require('./models/author');

const hostname = '127.0.0.1';
const port = 5000;

const app = express();

// View engine
app.engine('hbs', expressHbs({
    defaultLayout: 'mainLayout',
    layoutDir: 'views/layouts',
    extname: 'hbs',
    helpers: {
        idsAreEqual: compareHelper.idsAreEqual,
    }
}));
app.set('view engine', 'hbs');
app.set('views', 'views');

// Middlewares
const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads'),
    filename: (req, file, cb) => cb(null, `${uuidv4()}.jpg`)
});
app.use(multer({ storage: imageStorage }).single('imageFile'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(homeRouter);
app.use(bookRouter);
app.use(authorRouter);
app.use(categoryRouter);
app.use(editorialRouter);
app.use('/', errorController.get404);

// Relationships config
Category.hasMany(Book, { constraints: true, onDelete: 'CASCADE' });
Book.belongsTo(Category);
Editorial.hasMany(Book, { constraints: true, onDelete: 'CASCADE' });
Book.belongsTo(Editorial);
Author.hasMany(Book, { constraints: true, onDelete: 'CASCADE' });
Book.belongsTo(Author);

sequelize.sync()
    .then(result => app.listen(port, hostname, () => console.log(`http://${hostname}:${port}/`)))
    .catch(err => console.error(err));