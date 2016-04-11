const test = require('tape')
const request = require('supertest')
let server, token, credentials

const printError = error => {
	console.error('ERROR RESPONSE: ', error.body.error)
}

test('environment', t => {
	t.ok(process.env.VCAP_SERVICES, 'VCAP_SERVICES')
	t.ok(process.env.JWT_SECRET, 'JWT_SECRET')
	credentials = require('./test_user.json')
	t.ok(credentials.username, 'credentials.username')
	t.ok(credentials.password, 'credentials.password')
	t.end()
})

test('setup', t => {
	require('../app/database')
	.then(db => {
		t.ok(db, 'database should initialize')
		return require('../app/server')
	})
	.then(s => {
		t.ok(s, 'server should initialize')
		server = s
	})
	.catch(err => {
		t.notOk(err, 'should startup without errors')
	})
	.then(() => {
		t.end()
	})
})

test('register', t => {
	request(server)
	.post('/api/user')
	.send(credentials)
	.expect(200)
	.end((err, res) => {
		t.notOk(err, 'no error')
		if(err) printError(res)
		t.ok(res.body, 'user received')
		t.end()
	})
})

test('register - invalid email', t => {
	const invalidCredentials = {
		username: 'invalidusername',
		password: credentials.password
	}
	request(server)
	.post('/api/user')
	.send(invalidCredentials)
	.expect(400)
	.end((err, res) => {
		const expectedMsg = 'username is not a valid email address'
		t.notOk(err, 'no error')
		if(err) printError(res)
		t.same(res.body.error, expectedMsg, 'error message as expected')
		t.end()
	})
})

test('register - existing user', t => {
	request(server)
	.post('/api/user')
	.send(credentials)
	.expect(409)
	.end((err, res) => {
		const expectedMsg = 'username taken'
		t.notOk(err, 'no error')
		if(err) printError(res)
		t.same(res.body.error, expectedMsg, 'error message as expected')
		t.end()
	})
})

test('login - wrong username', t => {
	const invalidCredentials = {
		username: 'wrongusername',
		password: credentials.password
	}
	request(server)
	.post('/api/user/login')
	.send(invalidCredentials)
	.expect(401)
	.end((err, res) => {
		const expectedMsg = 'username does not exist'
		t.notOk(err, 'no error')
		if(err) printError(res)
		t.same(res.body.error, expectedMsg, 'error message as expected')
		t.end()
	})
})

test('login - wrong password', t => {
	const invalidCredentials = {
		username: credentials.username,
		password: 'wrongpassword'
	}
	request(server)
	.post('/api/user/login')
	.send(invalidCredentials)
	.expect(401)
	.end((err, res) => {
		const expectedMsg = 'incorrect password'
		t.notOk(err, 'no error')
		if(err) printError(res)
		t.same(res.body.error, expectedMsg, 'error message as expected')
		t.end()
	})
})

test('login', t => {
	request(server)
	.post('/api/user/login')
	.send(credentials)
	.expect(200)
	.end((err, res) => {
		t.notOk(err, 'no error')
		if(err) printError(res)
		t.ok(res.body.token, 'received token')
		token = res.body.token
		t.end()
	})
})

test('get /me', t => {
	request(server)
	.get('/api/user/me?token=' + token)
	.expect(200)
	.end((err, res) => {
		t.notOk(err, 'no error')
		if(err) printError(res)
		t.same(res.body.email, credentials.username, 'username as expected')
		t.end()
	})
})

test('get /me/photo', t => {
	request(server)
	.get('/api/user/me/photo?token=' + token)
	.expect(501)
	.end((err, res) => {
		t.notOk(err, 'no error')
		if(err) printError(res)
		t.same(res.body.photo, 'dummy photo', 'photo as expected')
		t.end()
	})
})

test('teardown', t => {
	t.end()
	process.exit(0)
})
