const http = require('http');
const yargs = require('yargs');


const options = { timeout: '', time: '' };
let timer;

const argv = yargs
	.option('timeout', {
		alias: 'p',
		describe: 'Console log timeout, ms',
		demandOption: true
	})
	.option('time', {
		alias: 't',
		describe: 'Console log time, ms',
		demandOption: true
	})
	.argv;



options.timeout = argv.timeout;
options.time = argv.time;


const consoleOutput = () => {
	return new Promise((resolve, reject) => {
		let time = options.time,
			date;

		if(timer) {
			clearTimeout(timer);
			console.log('Refresh timer');
		}

		timer = setTimeout(function tick() {
			date = new Date();

			console.log(date);

			time = time - options.timeout;

			if(time >= 0){
				timer = setTimeout(tick, options.timeout);
			}else{
				timer = null;
				resolve(date);
			}
		}, options.timeout);
	});
};


const port = 3000;
const server = http.createServer((req, res) => {
	// console.log(`Метод: ${req.method}`);
	// console.log(`URL: ${req.url}`);

	if (req.method === 'GET' && req.url === '/') {
		res.writeHead(200, { 'Content-Type': 'text/html; charset=utf8' });

		let p = consoleOutput();

		p.then(date => {
			res.end(date.toUTCString());
			console.log('DONE!!!');
		})

	}
});

server.listen(port, (err) => {
	if(err){
		console.log(err.message);
		return;
	}
	console.log(`Server running on port: ${port}`);
});

