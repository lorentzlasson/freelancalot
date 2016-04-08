module.exports = {
	model: {},

	options: {
		freezeTableName: true
	},

	relations: [
		['belongsTo', 'idea'],
		['belongsTo', 'status'],
		['belongsTo', 'customer']
	]
}
