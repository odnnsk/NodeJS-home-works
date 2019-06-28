const nodemailer = require('nodemailer');
const config = require('../config.json');

exports.send = req => new Promise(async (resolve, reject) => {
	try {
		if(!req.body.name || !req.body.email || !req.body.message){
			reject('Заполните все поля!');
			return;
		}

		const transporter = nodemailer.createTransport(config.mail.smtp);
		const mailOptions = {
			from: `"${req.body.name}" <${req.body.email}>`,
			to: config.mail.smtp.auth.user,
			subject: config.mail.subject,
			text:
			req.body.message.trim().slice(0, 500) +
			`\n Отправлено с: <${req.body.email}>`
		};
		// Send mail
		transporter.sendMail(mailOptions, (err, info) => {
			if (err) {
				reject(`При отправке письма произошла ошибка!: ${err}`);
				return;
			}

			resolve(true);
		});

	}
	catch (err) {
		reject(err);
		//Test error
		// reject({
		// 	success: false,
		// 	status: 500
		// });
	}
});