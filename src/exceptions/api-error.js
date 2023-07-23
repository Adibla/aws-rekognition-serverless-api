class ApiError extends Error {
	code;
	constructor(message, statusCode) {
		super(message);
		this.code = statusCode;
	}
}

module.exports = ApiError