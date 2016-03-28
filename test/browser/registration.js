const test = require('tape')
const webdriverio = require('webdriverio')
const url = require('./').url
var client, credentials

const options = {
	desiredCapabilities: {
		browserName: 'chrome'
	}
}

test('environment', t => {
	credentials = require('../test_user.json')
	t.ok(credentials.username, 'credentials.username')
	t.ok(credentials.password, 'credentials.password')
	t.end()
})

test('setup', t => {
	client = webdriverio
	.remote(options)
	.init()
	.url(url)
	.then(() => {
		t.end()
	})
})

test('register', t => {
	client
	.click('#register')
	.setValue('#username', credentials.username)
	.setValue('#password', credentials.password)
	.click('#register-btn')
	.pause(500)
	.then(() => {
		t.end()
	})
})

test('login', t => {
	client
	.click('#login')
	.setValue('#username', credentials.username)
	.setValue('#password', credentials.password)
	.click('#login-btn')
	.pause(500)
	.then(() => {
		t.end()
	})
})

test('confirm logged in', t => {
	client
	.click('#in')
	.pause(500)
	.getText('#email td:nth-Child(2)')
	.then(text => {
		t.same(text, credentials.username)
	})
	.end()
	.then(() => {
		t.end()
	})
})
