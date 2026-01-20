class AppError extends Error {
    constructor(message,status) {
        super(message)
        this.statusCode = status
        this.isOperational = true
    }
}

module.exports = AppError