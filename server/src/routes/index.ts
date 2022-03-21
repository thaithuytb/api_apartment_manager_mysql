import { Application, NextFunction, Request, Response } from 'express';
import routeUser from './user.route';
import routeRoom from './room.route';

const route = (app: Application) => {
    app.use(function(req: Request, res: Response, next: NextFunction) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
    });
    app.use('/room', routeRoom);
    app.use('/', routeUser);
};

export default route;