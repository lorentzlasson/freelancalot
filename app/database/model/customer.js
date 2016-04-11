const Sequelize = require('sequelize')

const customer = {
	model: {
		name: Sequelize.STRING
	},

	options: {
		freezeTableName: true
	},

	relations: [
		['hasMany', 'pitch']
	]
}

module.exports = customer
