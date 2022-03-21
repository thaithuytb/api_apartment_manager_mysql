import express, { Response } from 'express';
import userController from '../controllers/user.controller';
import authUser from '../middleware/authUser';
import { RequestType } from '../types/RequestType';
import authRole from './../middleware/authRole';
const routeUser = express.Router();

// routeUser.get('/', userController.getUsers);
routeUser.post('/login', userController.loginUser);
routeUser.post('/register', userController.registerUser);

routeUser.use(authUser, authRole('admin'));
routeUser.get('/user', (req: RequestType, res: Response) => {
    console.log(req.userID);
});

// routeUser.delete('/:id', userController.deleteUser);

export default routeUser;