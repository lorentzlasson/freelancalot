const Sequelize = require('sequelize')

const status = {
	model: {
		status: Sequelize.INTEGER,
		name: Sequelize.STRING
	},

	options: {
		freezeTableName: true
	},

	relations: [
		['hasMany', 'pitch']
	]
}

module.exports = status
