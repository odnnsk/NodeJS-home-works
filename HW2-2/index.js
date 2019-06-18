const yargs = require('yargs');
const path = require('path');
const fs = require('fs');
const walker = require('./libs/walker');

const paths = { entry: '', output: '' };

const argv = yargs
	.option('entry', {
		alias: 'e',
		describe: 'The path of the source folder',
		demandOption: true
	})
	.option('output', {
		alias: 'o',
		describe: 'The path of the output folder'
	})
	.option('delete', {
		alias: 'd',
		describe: 'Delete entry directory'
	})
	.argv;

paths.entry = path.normalize(path.join(__dirname, argv.entry));
paths.output = path.normalize(path.join(__dirname, argv.output));

// console.log(argv.delete);

//Create Output dir
if(!fs.existsSync(paths.output)) {
	fs.mkdirSync(paths.output, err => {
		if(err){
			console.log(err.message);
			return;
		}
	});
}

//callback
const copyFile = (filePath, done) => {
	try {
		const fileExtension = path.extname(filePath),
			fileName = path.basename(filePath, fileExtension),
			fileNameFull = path.basename(filePath),
			dirName = fileName[0].toUpperCase(),
			dirPath = path.normalize(path.join(paths.output, dirName));

		// console.log(path.normalize(path.join(dirPath, fileNameFull)));
		// console.log(fileNameFull);

		//Create File name dir
		if(!fs.existsSync(dirPath)) {
			fs.mkdirSync(dirPath, err => {
				if(err){
					console.log(err.message);
					return;
				}
			});
		}

		fs.linkSync(filePath, path.normalize(path.join(dirPath, fileNameFull)), err => {
			if(err){
				console.log(err.message);
				return;
			}
		});

		if(argv.delete){
			fs.unlinkSync(filePath, err => {
				if(err){
					console.log(err.message);
					return;
				}
			});

			let dir = path.parse(filePath).dir;
			let files = fs.readdirSync(dir);

			if(!files.length){
				fs.rmdirSync(dir, err => {
					console.log(err.message);
					return;
				});
				// console.log(dir);
			}

			// console.log(files.length);
		}

		done();
	} catch (err) {
		done(err);
	}
};

// walker(paths.entry, copyFile, err => {
// 	if (err) {
// 		return process.exit(500);
// 	}
//
// 	console.log('Done!');
// });


walker(paths.entry, copyFile).then(() => {
	console.log('Done!');
}).catch(err => {
	console.log(err);
});





// yourFunction(from, to, true).then(function(){
// 	console.log(‘Success’);
// })

process.on('exit', code => {
	switch (code) {
		case 500: {
			console.log('Copy file error!');
			break;
		}
		default: return null;
	}
});