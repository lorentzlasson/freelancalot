//Getting the orm instance
var orm = require("../model"),
    Seq = orm.Seq();

//Creating our module
module.exports = {
    model: {
        name: {
            type: Seq.STRING,
            allowNull: false
        },
        email: Seq.STRING,
        googleId: Seq.STRING,
        photo: Seq.STRING
    },

    options: {
        freezeTableName: true
    }

}
