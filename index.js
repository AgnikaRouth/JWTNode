const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

const secretKey = 'secretkey';

app.get('/', (req, res) => {
	res.json({
		message: 'sample API',
	});
});

app.post('/login', (req, res) => {
	const { name, email, password } = req.body;
	const user = {
		id: 1,
		username: name,
		email: email,
	};

	//perform validation - hardcoded
	if (!validateCredentials(email, password)) {
		return res.status(401).json({ message: 'Invalid credentials' });
	}

	jwt.sign({ user }, secretKey, { expiresIn: '200s' }, (err, token) => {
		if (err) {
			res.status(500).json({
				message: 'Error generating token',
			});
		} else {
			res.json({
				token,
				message: 'Login Successful',
			});
		}
	});
});

//this function will act as a middleware
const verifyToken = (req, res, next) => {
	const bearerHeader = req.headers['authorization'];

	if (bearerHeader !== undefined) {
		const bearerToken = bearerHeader.split(' ')[1];
		// console.log('Bearer token:', bearerToken);
		req.token = bearerToken;
		next(); //will redirect to app.post()
	} else {
		res.send({
			result: 'Token is not valid',
		});
	}
};

app.post('/profile', verifyToken, (req, res) => {
	jwt.verify(req.token, secretKey, (err, authData) => {
		if (err) {
			res.send({
				result: 'Invalid token',
			});
		} else {
			res.json({
				message: 'profile accessed',
				authData,
			});
		}
	});
});

//perform validation - hardcoded

const validateCredentials = (email, password) => {
	if (email == 'test@abc.com' && password == 'test@123') {
		return true;
	} else {
		return false;
	}
};

app.listen(5000, () => {
	console.log('App is running on port 5000');
});
