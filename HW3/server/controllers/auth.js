exports.auth = req => new Promise(async (resolve, reject) => {
	try {
		if (!req.body.email || !req.body.password) {
			reject('Email & pass are required');
			return;
		}

		if (req.body.email !== 'admin@admin.com' || req.body.password !== 'admin') {
			reject('Unathorized');
			return;
		}

		resolve(true);
	}
	catch(err) {
		reject(err);
	}
});