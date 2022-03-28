import express from 'express';
import userController from '../controllers/user.controller';
import authVerifyToken from '../middleware/authVerifyToken';
import authRole from './../middleware/authRole';
const routeUser = express.Router();

routeUser.post('/login', userController.loginUser);
routeUser.post('/register', userController.registerUser);

routeUser.use(authVerifyToken);
routeUser.get('/user', userController.getUser);
routeUser.get('/detailUser', userController.getDetailUser);
routeUser.put('/updateUser', userController.updateDetailUser);
routeUser.put('/changePW', userController.changePassword);

routeUser.use(authRole('admin'));
routeUser.get('/allUser', userController.getAllUser);

export default routeUser;