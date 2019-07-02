const nodemailer = require('nodemailer');
const config = require('../config.json');

exports.send = ({ name, email, message }) => new Promise(async (resolve, reject) => {
	try {
		if(!name || !email || !message){
			reject('Заполните все поля!');
			return;
		}

		const transporter = nodemailer.createTransport(config.mail.smtp);
		const mailOptions = {
			from: `"${name}" <${email}>`,
			to: config.mail.smtp.auth.user,
			subject: config.mail.subject,
			text:
			message.trim().slice(0, 500) +
			`\n Отправлено с: <${email}>`
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