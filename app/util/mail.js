const appEnv = require('cfenv').getAppEnv()
const mailConfig = appEnv.getServiceCreds('nodemailer')
const nodemailer = require('nodemailer')

const options =  {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, 
    auth: {
        user: mailConfig.email,
        pass: mailConfig.password 
    }
};

const transporter = nodemailer.createTransport(options)

const sendVerification = user => {
	return new Promise((resolve, reject) => {
		const mailOptions = {
			from: mailConfig.email,
			to: user.email,
			subject: "Verify your email",
			html: '<h2>Hi!</h2><div><span>Please verify your email <a href="http://localhost:6001/api/user/verify/' + user.emailToken + '">here</a></span></div>'
		}

		transporter.sendMail(mailOptions, function(err, info){
			if (err){
				return reject(err)
			} else {
				return resolve(info)
			}
		})
	})
}

module.exports = {
	sendVerification	
}
