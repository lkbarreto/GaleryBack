const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const cors = require('cors');
const methodOverride = require('method-override');


const app = express();

// Middleware


app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs')
app.use(methodOverride('_method'));

// Rutas
app.get('/', function(req, res) {
    res.render('index');
});

app.use('/api', require('./routes/index'));

// Middleware para Vue.js router modo history
const history = require('connect-history-api-fallback');
app.use(history());
app.use(express.static(path.join(__dirname, 'public')));


app.set('puerto', process.env.PORT || 4000);




module.exports = app