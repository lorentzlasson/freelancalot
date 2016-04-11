const isSeqError = error => {
	return error.name.includes('Sequelize')
}

const errorStatus = errorType => {
	switch(errorType){
	case 'unique violation':
		return 409

	default:
		return 400
	}
}

const handle = error => {
	let status, message
	if(isSeqError(error)){
		const firstError = error.errors[0] // Sequelize throw an array of errors
		status = errorStatus(firstError.type)
		message = {
			error: firstError.message
		}
	}
	else {
		status = 500
		message = {
			error: error.message
		}
	}

	return { status, message }
}

module.exports = handle
