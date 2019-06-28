const express = require('express');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Add static
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Session
app.use(
	session({
		secret: 'loftschool',
		key: 'sessionkey',
		cookie: {
			path: '/',
			httpOnly: true,
			maxAge: 10 * 60 * 1000
		},
		saveUninitialized: false,
		resave: false
	})
);


// Connect flash
const flash = require('connect-flash');
app.use(cookieParser('secret'));
app.use(flash());


// Routes
app.use('/', require('./routes/index'));

// catch 404 and forward to error handler
app.use((req, res, next) => {
	var err = new Error('Not Found');
	err.status = 404;
	next(err)
});

// error handler
app.use((err, req, res, next) => {
	// render the error page
	res.status(err.status || 500);
	// res.render('error', { message: err.message, error: err })
	res.send(`${err.status} ${err.message}`)
});

const server = app.listen(process.env.PORT || 3000, () => {
	console.log('Сервер запущен на порте: ' + server.address().port)
});
