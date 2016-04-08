const Sequelize = require('sequelize')

module.exports = {
	model: {
		name: Sequelize.STRING,
		summary: Sequelize.STRING
	},

	options: {
		freezeTableName: true
	},

	relations: [
		['belongsTo', 'hub'],
		['hasMany', 'pitch']
	]
}
