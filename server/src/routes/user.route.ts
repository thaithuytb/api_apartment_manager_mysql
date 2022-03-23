import express from 'express';
import userController from '../controllers/user.controller';
import authUser from '../middleware/authUser';
const routeUser = express.Router();

routeUser.post('/login', userController.loginUser);
routeUser.post('/register', userController.registerUser);

routeUser.use(authUser);
routeUser.get('/detailUser', userController.getDetailUser);
routeUser.post('/updateUser', userController.updateDetailUser);
routeUser.post('/changePW', userController.changePassword);


export default routeUser;