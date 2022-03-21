
import { NextFunction, Response, Request } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../entities/User';
import { RequestType } from '../types/RequestType';



const authRole = (role?: string) => {
    return async (req: RequestType, res: Response, next: NextFunction) => {
        try {
            if (role ? role === 'admin' ? true: false: false) {
                const user = await getRepository(User).findOne({userID: req.userID});
                if (user) {
                    if (user.isAdmin) {
                        next();
                        return res.status(200);
                    }  
                }
                res.status(403);
                return res.send('Not allowed');
            } 
            next();
        } catch (error) {
            console.log(error);
        }
    };
};

export default authRole;