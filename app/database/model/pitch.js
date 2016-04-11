const pitch = {
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

module.exports = pitch
