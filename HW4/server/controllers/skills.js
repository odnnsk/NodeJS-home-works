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

exports.add = ({ age, concerts, cities, years }) => new Promise(async (resolve, reject) => {
	try {
		//Save data
		if(age) db.set('skills[0].number', age).write();
		if(concerts) db.set('skills[1].number', concerts).write();
		if(cities) db.set('skills[2].number', cities).write();
		if(years) db.set('skills[3].number', years).write();


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