const db = require('../models');


exports.get = () => new Promise(async (resolve, reject) => {
	try {
		let result = db.get('skills').value();

		resolve(result);
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

exports.add = req => new Promise(async (resolve, reject) => {
	try {
		//Save data
		if(req.body.age) db.set('skills[0].number', req.body.age).write();
		if(req.body.concerts) db.set('skills[1].number', req.body.concerts).write();
		if(req.body.cities) db.set('skills[2].number', req.body.cities).write();
		if(req.body.years) db.set('skills[3].number', req.body.years).write();


		// db.get('skills')
		// 	.each((item) => item.number = 3)
		// 	.write();

		resolve(true);
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