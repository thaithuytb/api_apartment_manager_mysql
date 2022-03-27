import express from 'express';
import authVerifyToken from '../middleware/authVerifyToken';
import billController from '../controllers/bill.controller';
import roomRole from '../middleware/roomRole';

const billRoute = express.Router();

billRoute.use(authVerifyToken);
billRoute.get('/:roomID',roomRole, billController.getBillDetail);

export default billRoute;
