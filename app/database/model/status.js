const Sequelize = require('sequelize')

module.exports = {
	model: {
		status: Sequelize.INTEGER,
		name: Sequelize.STRING
	},

	options: {
		freezeTableName: true
	},

	relations: [
		['hasOne', 'hub']
	]
}
