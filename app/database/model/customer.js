const Sequelize = require('sequelize')

module.exports = {
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
