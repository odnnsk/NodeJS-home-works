const fs = require('fs');
const path = require('path');
const db = require('../models');
const formidable = require('formidable');


exports.get = () => new Promise(async (resolve, reject) => {
	try {
		let result = db.get('products').value();

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
		// parse a form with file upload. multipart/form-data
		const form = new formidable.IncomingForm();
		const uploadDir = path.join(process.cwd(), '/public', 'assets', 'img', 'products');

		if (!fs.existsSync(uploadDir)) {
			fs.mkdirSync(uploadDir)
		}

		form.uploadDir = uploadDir;
		
		form.parse(req, (err, fields, files) => {
			if(err) reject(err);
			
			if(!fields.name || !fields.price){
				fs.unlinkSync(files.photo.path);
				reject('All fields are required!');
			}

			if(files.photo.name === '' || !files.photo.size === 0){
				fs.unlinkSync(files.photo.path);
				reject('All fields are required!');
			}

			const fileName = path.join(uploadDir, files.photo.name)

			fs.rename(files.photo.path, fileName, (err) => {
				if(err) reject(err);

				//Save data
				db.get('products')
					.push({ src: "./assets/img/products/" + files.photo.name, name: fields.name, price: fields.price})
					.write();

				resolve(true);
			});

		});
	}
	catch(err) {
		reject(err);
	}
});