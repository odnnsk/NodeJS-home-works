const fs = require('fs');
const path = require('path');
const db = require('../models');


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


exports.add = ({photo, name, price}) => new Promise(async (resolve, reject) => {
	try {
		const { name: photoName, size, path: tempPath } = photo;
		const uploadDir = path.join(process.cwd(), '/public', 'assets', 'img', 'products');

		if (!fs.existsSync(uploadDir)) {
			fs.mkdirSync(uploadDir)
		}

		if(!name || !price){
			fs.unlinkSync(tempPath);
			reject('All fields are required!');
			return;
		}

		if(!photoName || !size){
			fs.unlinkSync(tempPath);
			reject('File not saved');
			return;
		}

		const fileName = path.join(uploadDir, photoName);

		fs.rename(tempPath, fileName, (err) => {
			if(err) reject(err);

			//Save data
			db.get('products')
				.push({ src: "./assets/img/products/" + photoName, name: name, price: price})
				.write();

			resolve(true);
		});
	}
	catch(err) {
		reject(err);
	}
});