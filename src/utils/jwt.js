import JWT from 'jsonwebtoken'

export default {
    sign: payload => JWT.sign(payload, 'secret'),
    verify: token => JWT.verify(token, 'secret'),
}