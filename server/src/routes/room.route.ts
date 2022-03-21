import express from 'express';
import roomController from '../controllers/room.controller';
import authRole from './../middleware/authRole';
import authUser from './../middleware/authUser';

const routeRoom = express.Router();

routeRoom.get('/', roomController.getAllRoom);

routeRoom.use(authUser, authRole('admin'));
routeRoom.post('/', roomController.createRoom);
routeRoom.put('/:id', roomController.updateRoom);
routeRoom.delete('/:id', roomController.deleteRoom);



export default routeRoom;