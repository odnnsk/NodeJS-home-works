exports.auth = ctx => new Promise(async (resolve, reject) => {
	try {
		const { email, password } = ctx.request.body;

		if (!email || !password) {
			reject('Email & pass are required');
			return;
		}

		if (email !== 'admin@admin.com' || password !== 'admin') {
			reject('Unathorized');
			return;
		}

		ctx.session.isAuth = true;

		resolve(true);
	}
	catch(err) {
		reject(err);
	}
});