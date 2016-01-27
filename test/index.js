var test = require('tape'),
	request = require('supertest'),
	server = require('../app')

test('GET /hello', (t) => {
	request(server)
	.get('/api/v1/hello')
	.end((err, res) => {
		t.same(res.status, 403, 'Status code as expected')
		t.end()
	})
})
