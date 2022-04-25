export class NotFoundError extends Error {
    constructor(status, message) {
        super()
        this.name = 'NotFoundError'
        this.message = message
        this.status = status
    }
}

export class ForbiddenError extends Error {
    constructor(status, message) {
        super()
        this.name = 'ForbiddenError'
        this.message = message
        this.status = status
    }
}

export class ValidationError extends Error {
    constructor(status, message) {
        super()
        this.name = 'ValidationError'
        this.message = message
        this.status = status
    }
}

export class AuthorizationError extends Error {
    constructor(status, message) {
        super()
        this.name = 'AuthorizationError'
        this.message = message
        this.status = status
    }
}

export class InternalServerError extends Error {
    constructor(status, message) {
        super()
        this.name = 'InternalServerError'
        this.message = message
        this.status = status
    }
}