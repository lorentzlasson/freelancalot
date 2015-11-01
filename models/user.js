//Getting the orm instance
var orm = require("../model"),
    Seq = orm.Seq();
var bcrypt = require('bcrypt-nodejs');

//Creating our module
module.exports = {
    model: {
        name: Seq.STRING,
        email: Seq.STRING,
        password: Seq.STRING,
        googleId: Seq.STRING,
        photo: Seq.STRING,
        permission: {
            type: Seq.STRING,
            defaultValue: 'admin'
        }
    },

    options: {
        freezeTableName: true,
        setterMethods: {
            password: function(value) {
                var hash = bcrypt.hashSync(value)
                this.setDataValue('password',hash);
            }
        },
        instanceMethods: {
            validPassword: function(password) {
                return bcrypt.compareSync(password, this.password);
            }
        }
    }

}
