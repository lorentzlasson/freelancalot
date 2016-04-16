const Sequelize = require('sequelize')
const bcrypt = require('bcrypt')

const user = {
	model: {
		name: Sequelize.STRING,
		email: {
			type: Sequelize.STRING,
			allowNull: false,
			unique: {
				msg: 'username taken'
			},
			validate: {
				isEmail: {
					msg: 'username is not a valid email address'
				}
			}
		},
		password: {
			type: Sequelize.VIRTUAL,
			validate: {
				is: {
					args: /^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{6,20}$/,
					msg: 'password is invalid'
				}
			}
		},
		password_hash: Sequelize.STRING,
		photo: Sequelize.STRING,	
		verifiedEmail: Sequelize.BOOLEAN,
		emailToken: Sequelize.STRING,
		emailTokenExpires: Sequelize.DATE,
		permission: {
			type: Sequelize.STRING,
			defaultValue: 'admin'
		}
	},

	options: {
		freezeTableName: true,
		setterMethods: {
			password: function(value) {
				this.setDataValue('password', value)
				this.password_hash = value
			},
			password_hash: function(value) {
				const salt = bcrypt.genSaltSync()
				const hash = bcrypt.hashSync(value, salt)
				this.setDataValue('password_hash', hash)
			}
		},
		instanceMethods: {
			validPassword: function(password) {
				return bcrypt.compareSync(password, this.password_hash)
			}
		}
	},

	relations: [
		['belongsToMany', 'hub', {
			through: 'userHub'
		}]
	]
}

module.exports = user
