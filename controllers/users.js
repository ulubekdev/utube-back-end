import { AuthorizationError, InternalServerError } from '../utils/errors.js';
import JWT from '../utils/jwt.js';
import sha256 from 'sha256';
import path from 'path';

const REGISTER = (req, res, next ) => {
    try {
        let users = req.readFile('users');
        
        let { username, password } = req.body;
        let file = req.files;

        if(!username || !password) {
            return next(new AuthorizationError(400, 'Username and password are required'));
        }

        if(users.find(user => user.username === username)) {
            return next(new AuthorizationError(400, 'Username already exists. Try another one'));
        }

        if(!file) {
            return next(new AuthorizationError(400, 'Please upload a profile picture'));
        }
        
        if(file.size > 1024 * 1024) {
            return next(new AuthorizationError(400, 'Image size must be less than 1 MB'));
        }
        
        if(file.image.mimetype !== 'image/jpeg' && file.image.mimetype !== 'image/png' && file.image.mimetype !== 'image/jpg') {
            return next(new AuthorizationError(400, 'File must be a jpeg or png or jpg'));
        }
        let fileName = Date.now() + '-' + file.image.name;
        let filePath = path.join(process.cwd(), 'uploads', 'images', fileName);

        file.image.mv(filePath, (error) => {
            if(error) {
                return next(new AuthorizationError(500, error.message));
            }
        });

        let user = {
            id: users.length ? users[users.length - 1].id + 1 : 1,
            username,
            password: sha256(password),
            userImg: fileName
        };

        users.push(user);

        req.writeFile('users', users);

        res.status(201).json({
            status: 201,
            message: 'User created successfully',
            data: user,
            token: JWT.sign({ userId: user.id, agent: req.headers['user-agent'] })
        });
        
    } catch (error) {
        return next(new InternalServerError(500, error.message))
    }
};


const GET = (req, res, next) => {
    try {
        let users = req.readFile('users');
        res.status(200).json({
            status: 200,
            message: 'Users retrieved successfully',
            data: users,
            token: null
        });

    } catch (error) {
        return next(new InternalServerError(500, error.message));
    }
}


const LOGIN = (req, res, next) => {
    try {
        let users = req.readFile('users');
        let { username, password } = req.body;

        if(!username || !password) {
            return next(new AuthorizationError(400, 'Username and password are required'));
        }
        
        let user = users.find(user => user.username === username);

        if(!user) {
            return next(new AuthorizationError(400, 'Username does not exist'));
        }

        if(user.password !== sha256(password)) {
            return next(new AuthorizationError(400, 'Password is incorrect'));
        }

        res.status(200).json({
            status: 200,
            message: 'User logged in successfully',
            data: user,
            token: JWT.sign({ userId: user.id, agent: req.headers['user-agent']})
        });

    } catch (error) {
        return next(new InternalServerError(500, error.message));
    }
}

export default {
    REGISTER,
    GET,
    LOGIN
}