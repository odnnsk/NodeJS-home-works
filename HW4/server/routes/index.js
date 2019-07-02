const Router = require('koa-router');
const router = new Router();

const productsCtrl = require('../controllers/products.js');
const skillsCtrl = require('../controllers/skills.js');
const authCtrl = require('../controllers/auth.js');
const mailCtrl = require('../controllers/mail.js');


router.get('/', async (ctx, next) => {
	try{
		const products = await productsCtrl.get();
		const skills = await skillsCtrl.get();

		const msgsemail = ctx.flash && ctx.flash.get() ? ctx.flash.get().msgsemail : null;

		ctx.render('index', {
			products,
			skills,
			msgsemail
		});
	}
	catch(err){
		ctx.throw(404, err);
	}
});

router.post('/', async (ctx, next) => {
	try{
		await mailCtrl.send(ctx.request.body);
		ctx.flash('msgsemail', 'Сообщение отправлено!');
		ctx.redirect('/');
	}
	catch(err){
		console.error(err);
		ctx.flash.set({msgsemail: err});
		ctx.redirect('/');
	}
});

router.get('/login', async (ctx, next) => {
	// console.log("ctx.flash",  ctx.flash);
	try{
		const msgslogin = ctx.flash && ctx.flash.get() ? ctx.flash.get().msgslogin : null;

		ctx.render('login', {
			msgslogin
		});
	}catch(err){
		ctx.throw(404, err);
	}
});

router.post('/login', async (ctx, next) => {
	try{
		await authCtrl.auth(ctx.request.body);
		ctx.session.isAuth = true;

		ctx.redirect('/admin');
	}
	catch(err){
		console.error('err', err);
		ctx.flash.set({msgslogin: err});
		ctx.redirect('/login');
	}
});

router.get('/admin', async (ctx, next) => {
	try{
		if(!ctx.session.isAuth) {
			ctx.redirect('/login');
			return;
		}

		const msgfile = ctx.flash && ctx.flash.get() ? ctx.flash.get().msgfile : null;
		const msgskill = ctx.flash && ctx.flash.get() ? ctx.flash.get().msgskill : null;

		ctx.render('admin', {
			msgfile,
			msgskill
		});
	}catch(err){
		ctx.throw(404, err);
	}
});

router.post('/admin/upload', async (ctx, next) => {
	try{
		await productsCtrl.add({...ctx.request.files, ...ctx.request.body});
		ctx.flash.set({msgfile: 'Картинка успешно загружена!'});
		ctx.redirect('/admin');
	}
	catch(err){
		console.error(err);
		ctx.flash.set({msgfile: err});
		ctx.redirect('/admin');
	}
});

router.post('/admin/skills', async (ctx, next) => {
	try{
		// await skillsCtrl.add({...ctx.request.body});
		await skillsCtrl.add(ctx.request.body);
		ctx.flash.set({msgskill: 'Скилы сохранены!'});
		ctx.redirect('/admin');
	}
	catch(err){
		console.error(err);
		ctx.flash.set('msgskill', err);
		ctx.redirect('/admin');
	}
});



module.exports = router;