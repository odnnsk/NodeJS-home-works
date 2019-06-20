const yargs = require('yargs');
const path = require('path');
const fs = require('fs');
const walker = require('./libs/walker');
const util = require('util');
const mkdir = util.promisify(fs.mkdir);
const rmdir = util.promisify(fs.rmdir);
const fsLink = util.promisify(fs.link);
const fsUnlink = util.promisify(fs.unlink);

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
// const createOutputDir = () => {
// 	return mkdir(paths.output);
// };

// createOutputDir().then(() => {
// 	console.log('ok');
// });



//Create Output dir
if(!fs.existsSync(paths.output)) {
	fs.mkdirSync(paths.output, err => {
		if(err){
			console.log(err.message);
			return;
		}
	});
}



const copyFile = filePath => {
	return new Promise(function(resolve, reject) {
		const fileExtension = path.extname(filePath),
			fileName = path.basename(filePath, fileExtension),
			fileNameFull = path.basename(filePath),
			dirName = fileName[0].toUpperCase(),
			dirPath = path.normalize(path.join(paths.output, dirName));


		//Create File name dir
		if (!fs.existsSync(dirPath)) {
			fs.mkdirSync(dirPath, err => {
				if (err) {
					console.log(err.message);
					return;
				}
			});
		}

		fsLink(filePath, path.normalize(path.join(dirPath, fileNameFull))).then(() => {
			if (argv.delete) {
				return fsUnlink(filePath).then(resolve).catch(err => {
					reject(err)
				})
			} else {
				return resolve();
			}
		}).catch(err => {
			reject(err);
		})

	})
};

const removeDir = dir => {
	return rmdir(dir);
};


walker(paths.entry, copyFile, argv.delete ? removeDir : false).then(() => {
	console.log('done!');
}).catch(err => {
	console.log(err);
	process.exit(500);
});


process.on('exit', code => {
	switch (code) {
		case 500: {
			console.log('Copy file error!');
			break;
		}
		default: return null;
	}
});

