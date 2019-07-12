const Koa = require('koa');
const app = new Koa();
const Pug = require('koa-pug');
const static = require('koa-static');
const session = require('koa-session');
const flash = require('koa-flash-simple');
const koaBody = require('koa-body');
const router = require('./routes');


//View
const pug = new Pug({
	viewPath: './views/pages',
	basedir: './views',
	pretty: true,
	noCache: true,
	app: app
});

//Static
app.use(static('./public'));

//Session
app.use(session({
	key: 'koa:sess',
	maxAge: 10 * 60 * 1000,
	overwrite: true,
	httpOnly: true,
	signed: false,
	rolling: false,
	renew: false
}, app));

//Flash message
app.use(flash());

//Koa body
app.use(koaBody({
	formidable: {
		uploadDir: './public/assets/img/products/'
	},
	multipart: true
}));

//Routes
app.use(router.routes());
app.use(router.allowedMethods());


//Error handler
app.on('error', (ctx) => {
	console.error(`${ctx.status} ${ctx.message}`);
	/* centralized error handling:
	 *   console.log error
	 *   write error to log file
	 *   save error and request information to database if ctx.request match condition
	 *   ...
	 */
});


const server = app.listen(process.env.PORT || 3000, () => {
	console.log('Сервер запущен на порте: ' + server.address().port)
});