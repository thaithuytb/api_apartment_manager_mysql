import express from 'express';
import roomController from '../controllers/room.controller';
import authRole from './../middleware/authRole';
import authUser from './../middleware/authUser';

const routeRoom = express.Router();

routeRoom.use(authUser);
routeRoom.get('/:id',roomController.getRoomDetail);

routeRoom.use(authRole('admin'));
routeRoom.post('/', roomController.createRoom);
routeRoom.put('/:id', roomController.updateRoom);
routeRoom.delete('/:id', roomController.deleteRoom);
routeRoom.get('/', roomController.getAllRoom);



export default routeRoom;