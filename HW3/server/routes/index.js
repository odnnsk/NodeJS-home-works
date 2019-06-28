const express = require('express');
const router = express.Router();

const productsCtrl = require('../controllers/products.js');
const skillsCtrl = require('../controllers/skills.js');
const authCtrl = require('../controllers/auth.js');
const mailCtrl = require('../controllers/mail.js');


router.get('/', async (req, res, next) => {
	try{
		const products = await productsCtrl.get();
		const skills = await skillsCtrl.get();
		let msgsemail = req.flash('msgsemail');

		msgsemail = msgsemail.length ? msgsemail : null;

		res.render('pages/index', {
			products,
			skills,
			msgsemail
		});
	}
	catch(err){
		console.error(err);
		next();
	}
});

router.post('/', async (req, res, next) => {
	try{
		await mailCtrl.send(req);
		req.flash('msgsemail', 'Сообщение отправлено!');
		res.redirect('/');
	}
	catch(err){
		console.error(err);
		req.flash('msgsemail', err);
		res.redirect('/');
	}
});

router.get('/login', (req, res) => {
	let msgslogin = req.flash('msgslogin');

	msgslogin = msgslogin.length ? msgslogin : null;

	res.render('pages/login', {
		msgslogin
	});
});

router.post('/login', async (req, res, next) => {
	try{
		await authCtrl.auth(req);
		req.session.isAuth = true;

		res.redirect('/admin');
	}
	catch(err){
		console.error(err);
		req.flash('msgslogin', err);
		res.redirect('/login');
	}
});

router.get('/admin', (req, res) => {
	if(!req.session.isAuth) {
		res.redirect('/login');
		return;
	}

	let msgfile = req.flash('msgfile');
	let msgskill = req.flash('msgskill');

	msgfile = msgfile.length ? msgfile : null;
	msgskill = msgskill.length ? msgskill : null;

	res.render('pages/admin', {
		msgfile,
		msgskill
	});
});

router.post('/admin/upload', async (req, res, next) => {
	try{
		await productsCtrl.add(req);
		req.flash('msgfile', 'Картинка успешно загружена!');
		res.redirect('/admin');
	}
	catch(err){
		console.error(err);
		req.flash('msgfile', err);
		res.redirect('/admin');
	}
});

router.post('/admin/skills', async (req, res, next) => {
	try{
		await skillsCtrl.add(req);
		req.flash('msgskill', 'Скилы сохранены!');
		res.redirect('/admin');
	}
	catch(err){
		console.error(err);
		req.flash('msgskill', err);
		res.redirect('/admin');
	}
});



module.exports = router;