import express from 'express';
import userController from '../controllers/user.controller';
import authVerifyToken from '../middleware/authVerifyToken';
import authRole from './../middleware/authRole';
const routeUser = express.Router();

routeUser.post('/login', userController.loginUser);
routeUser.post('/register', userController.registerUser);

routeUser.use(authVerifyToken);
routeUser.get('/', userController.getUser);
routeUser.get('/detailUser', userController.getDetailUser);
routeUser.post('/updateUser', userController.updateDetailUser);
routeUser.post('/changePW', userController.changePassword);

routeUser.use(authRole('admin'));
routeUser.get('/allUser', userController.getAllUser);

export default routeUser;