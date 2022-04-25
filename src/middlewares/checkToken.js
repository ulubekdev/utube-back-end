import { ForbiddenError } from "../utils/errors.js"
import JWT from "../utils/jwt.js"

export default (req, res, next) => {
    try {
        const { token } = req.headers;
    
        if (!token) {
            return next(new ForbiddenError(403, "No Token"))
        }

        const { userId, agent } = JWT.verify(token, 'secret');

        const reqAgent = req.headers['user-agent'];

        if (agent !== reqAgent) {
            return next(new ForbiddenError(403, "It is a different device"))
        }

        if (!req.readFile('users').some(user => user.id == userId)) {
            return next(new ForbiddenError(403, "User does not exist"))
        }

        req.id = userId;

        return next();
    } catch (error) {
        return next(new ForbiddenError(403, error.message));
    }
}