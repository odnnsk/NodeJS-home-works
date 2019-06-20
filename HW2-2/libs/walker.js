const fs = require('fs');
const path = require('path');
const util = require('util');
const readdir = util.promisify(fs.readdir);
const fsStat = util.promisify(fs.stat);

const walk = function (dir, callbackOnFile, callbackOnFolder) {
	return new Promise(function(resolve, reject) {
		readdir(dir).then(list => {
			let i = 0;

			const next = () => {
				let filePath = list[i++];

				if (!filePath){
					if(callbackOnFolder){
						return callbackOnFolder(dir).then(resolve).catch(err => { reject(err) });
					}else{
						return resolve();
					}

					// console.log(dir);
					// return resolve();
				}

				filePath = path.join(dir, filePath);

				fsStat(filePath).then((stat) => {
					if (stat && stat.isDirectory()) {
						walk(filePath, callbackOnFile, callbackOnFolder).then(next).catch(err => { reject(err) });
					} else {
						callbackOnFile(filePath).then(next).catch(err => { reject(err) });
					}
				})

			};

			next()
		}).catch(err => {
			reject(err);
		})
	})
};

module.exports = walk;