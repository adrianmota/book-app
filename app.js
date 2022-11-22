const express = require('express');
const expressHbs = require('express-handlebars');
const path = require('path');
const sequelize = require('./context/appContext');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const homeRouter = require('./routes/home');
const errorController = require('./controllers/errorController');
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
    helpers: {}
}));
app.set('view engine', 'hbs');
app.set('views', 'views');

// Middlewares
const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads'),
    filename: (req, file, cb) => cb(null, uuidv4())
});
app.use(multer({ storage: imageStorage }).single('imageFile'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(homeRouter);
app.use('/', errorController.get404);

// Relationships config
Category.hasMany(Book);
Book.belongsTo(Category, { constraints: true, onDelete: 'CASCADE' });
Editorial.hasMany(Book);
Book.belongsTo(Editorial, { constraints: true, onDelete: 'CASCADE' });
Author.hasMany(Book);
Book.belongsTo(Author, { constraints: true, onDelete: 'CASCADE' });

sequelize.sync()
    .then(result => app.listen(port, hostname, () => console.log(`http://${hostname}:${port}/`)))
    .catch(err => console.error(err));