import { InternalServerError } from '../utils/errors.js'
import path from 'path'
import fs from 'fs'

export default ({ databasePath }) => {
    return (req, res, next) => {
        try {
            req.readFile = function (fileName) {
                const jsonData = fs.readFileSync(path.join(databasePath, fileName + '.json'), 'UTF-8')
                return JSON.parse(jsonData) || []
            }

            req.writeFile = function (fileName, data) {
                fs.writeFileSync(path.join(databasePath, fileName + '.json'), JSON.stringify(data, null, 4))
            }
            return next()
        } catch (error) {
            return next(new InternalServerError(500, error.message))
        }
    }
}