const Sequelize = require('sequelize')
const bcrypt = require('bcrypt')

module.exports = {
	model: {
		name: Sequelize.STRING,
		email: Sequelize.STRING,
		password: Sequelize.STRING,
		photo: Sequelize.STRING,
		permission: {
			type: Sequelize.STRING,
			defaultValue: 'admin'
		}
	},

	options: {
		freezeTableName: true,
		setterMethods: {
			password: function(value) {
				const salt = bcrypt.genSaltSync()
				const hash = bcrypt.hashSync(value, salt)
				this.setDataValue('password', hash)
			}
		},
		instanceMethods: {
			validPassword: function(password) {
				return bcrypt.compareSync(password, this.password)
			}
		}
	}
}
