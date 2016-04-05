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
			from: mainConfig.email,
			to: user.email,
			subject: 'Account verfication',
			text: 'Hi! Please verify your account!'
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
