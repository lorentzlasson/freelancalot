const test = require('tape')
const request = require('supertest')
let server, token, credentials

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
		t.error(err, 'should startup without errors')
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
		t.error(err, 'no error')
		t.ok(res.body, 'user received')
		t.end()
	})
})

test('register - invalid email', t => {
	let invalidCredentials = {
		username: 'invalidusername',
		password: credentials.password
	}
	request(server)
	.post('/api/user')
	.send(invalidCredentials)
	.expect(400)
	.end((err, res) => {
		let expectedMsg = 'username is not a valid email address'
		t.error(err, 'no error')
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
		let expectedMsg = 'username taken'
		t.error(err, 'no error')
		t.same(res.body.error, expectedMsg, 'error message as expected')
		t.end()
	})
})

test('login - wrong username', t => {
	let invalidCredentials = {
		username: 'wrongusername',
		password: credentials.password
	}
	request(server)
	.post('/api/user/login')
	.send(invalidCredentials)
	.expect(401)
	.end((err, res) => {
		let expectedMsg = 'username does not exist'
		t.error(err, 'no error')
		t.same(res.body.error, expectedMsg, 'error message as expected')
		t.end()
	})
})

test('login - wrong password', t => {
	let invalidCredentials = {
		username: credentials.username,
		password: 'wrongpassword'
	}
	request(server)
	.post('/api/user/login')
	.send(invalidCredentials)
	.expect(401)
	.end((err, res) => {
		let expectedMsg = 'incorrect password'
		t.error(err, 'no error')
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
		t.error(err, 'no error')
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
		t.error(err, 'no error')
		t.same(res.body.email, credentials.username, 'username as expected')
		t.end()
	})
})

test('get /me/photo', t => {
	request(server)
	.get('/api/user/me/photo?token=' + token)
	.expect(501)
	.end((err, res) => {
		t.error(err, 'no error')
		t.same(res.body.photo, 'dummy photo', 'photo as expected')
		t.end()
	})
})

test('teardown', t => {
	t.end()
	process.exit(0)
})
