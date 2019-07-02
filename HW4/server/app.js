const Koa = require('koa');
const app = new Koa();

const Pug = require('koa-pug');
const pug = new Pug({
	viewPath: './views/pages',
	basedir: './views',
	pretty: true,
	noCache: true,
	app: app
});

const static = require('koa-static');
app.use(static('./public'));

const session = require('koa-session');
app.use(session({
	key: 'koa:sess',
	maxAge: 10 * 60 * 1000,
	overwrite: true,
	httpOnly: true,
	signed: false,
	rolling: false,
	renew: false
}, app));

const flash = require('koa-flash-simple');
app.use(flash());

const koaBody = require('koa-body');
app.use(koaBody({
	formidable: {
		uploadDir: './public/assets/img/products/'
	},
	multipart: true
}));

const router = require('./routes');
app.use(router.routes());
app.use(router.allowedMethods());


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